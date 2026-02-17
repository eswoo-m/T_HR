import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseDate, toSafeDate, subtractDaysSafe } from '@common/utils/date.util';
import { OrganizationDetailResponseDto } from './dto/organization-detail-response.dto';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationChangeDto } from '@modules/organization/dto/delete-organization.dto';
import { GetOrganizationHistoryDto, OrgChangeType } from '@modules/organization/dto/get-organization-history.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async registerOrganization(dto: RegisterOrganizationDto) {
    const { name, startDate, parentId, desc } = dto;

    const existingOrg = await this.prisma.organization.findFirst({
      where: {
        name,
        parentId: parentId || null,
      },
    });

    if (existingOrg) {
      throw new ConflictException(`해당 상위 조직 아래에 이미 '${name}' 조직이 존재합니다.`);
    }

    if (parentId) {
      const parent = await this.prisma.organization.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException('지정된 상위 조직을 찾을 수 없습니다.');
      }
    }

    const parsedStartDate = parseDate(startDate);
    if (!parsedStartDate) {
      throw new BadRequestException('유효하지 않은 날짜 형식입니다. (YYYY-MM-DD 권장)');
    }

    return this.prisma.organization.create({
      data: {
        name,
        startDate: parsedStartDate,
        parentId: parentId || null,
        desc: desc || null,
      },
    });
  }

  async getOrganizationDetail(id: number): Promise<OrganizationDetailResponseDto> {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        children: true,
        employee: true,
        // _count는 그대로 유지 ㅋ
        _count: {
          select: { employee: true },
        },
      },
    });

    if (!org) throw new NotFoundException('조직을 찾을 수 없습니다.');

    return {
      id: org.id,
      name: org.name,
      memberCount: org._count.employee,

      activeProject: null,

      subOrganizations: org.children.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.desc ?? '',
      })),

      members: org.employee.map((e) => ({
        id: e.id,
        name: e.nameKr,
        jobRole: e.jobRole ?? '',
      })),
    };
  }

  async updateOrganization(id: number, dto: UpdateOrganizationDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`ID가 ${id}인 조직을 찾을 수 없습니다.`);
    }

    return this.prisma.organization.update({
      where: { id },
      data: {
        desc: dto.desc,
      },
    });
  }

  async handleOrganizationChange(id: number, dto: OrganizationChangeDto) {
    const { changeDate, name, parentId, desc } = dto;

    const targetDate = parseDate(changeDate);
    if (!targetDate) {
      throw new BadRequestException('변경일자 형식이 올바르지 않거나 비어있습니다.');
    }

    return this.prisma.$transaction(async (tx) => {
      const oldOrg = await tx.organization.findUnique({
        where: { id },
        include: {
          employee: true,
          /* [임시 주석]
          projects: {
            where: {
              OR: [
                { endDate: null },
                { endDate: { gte: toSafeDate(targetDate) } },
              ],
            },
          },
          */
        },
      });

      if (!oldOrg) throw new NotFoundException('해당 부서를 찾을 수 없습니다.');

      // [임시 우회]
      const activeProjects: any[] = [];
      if (activeProjects.length > 0) {
        const projectNames = activeProjects.map((p) => p.name).join(', ');
        throw new BadRequestException(`진행 중인 프로젝트(${projectNames})가 있어 처리가 불가능합니다.`);
      }

      const targetParentId = parentId ?? oldOrg.parentId;

      try {
        if (name) {
          await tx.organization.update({
            where: { id },
            data: { endDate: subtractDaysSafe(targetDate, 1) },
          });

          const newOrg = await tx.organization.create({
            data: {
              name,
              parentId: parentId ?? oldOrg.parentId,
              startDate: toSafeDate(targetDate),
              desc: desc ?? oldOrg.desc,
            },
          });

          for (const emp of oldOrg.employee) {
            await tx.employeeOrganizationHistory.create({
              data: {
                employeeId: emp.id,
                departmentId: parentId ?? (oldOrg.parentId || newOrg.id),
                teamId: parentId ? newOrg.id : null,
                applyDate: toSafeDate(targetDate),
                jobLevel: emp.jobLevel,
                jobRole: emp.jobRole,
              },
            });
          }

          return { message: '부서 정보가 변경되어 신규 부서가 생성되었습니다.', newId: newOrg.id };
        } else {
          await tx.organization.update({
            where: { id },
            data: { endDate: toSafeDate(targetDate) },
          });

          if (oldOrg.employee.length > 0) {
            for (const emp of oldOrg.employee) {
              await tx.employeeOrganizationHistory.create({
                data: {
                  employeeId: emp.id,
                  departmentId: targetParentId ?? oldOrg.id,
                  teamId: null,
                  applyDate: toSafeDate(targetDate),
                  jobLevel: emp.jobLevel,
                  jobRole: emp.jobRole,
                },
              });
            }
          }
          return { message: '부서가 종료 처리되었으며 구성원이 상위 부서로 이동되었습니다.' };
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'DB 처리 중 오류 발생';
        throw new InternalServerErrorException(message);
      }
    });
  }

  async getOrganizationHistory(dto: GetOrganizationHistoryDto) {
    const { searchKeyword, startDate, endDate, type, tab } = dto;
    const now = new Date();
    const isScheduled = tab === 'scheduled';

    const where: Prisma.OrganizationWhereInput = {};

    if (isScheduled) {
      where.OR = [{ startDate: { gt: now } }, { endDate: { gt: now } }];
    } else {
      where.OR = [{ startDate: { lte: now } }, { endDate: { lte: now, not: null } }];
    }

    if (searchKeyword) {
      where.name = { contains: searchKeyword };
    }

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (type === OrgChangeType.NEW) {
      where.endDate = null;
    } else if (type === OrgChangeType.CLOSE) {
      where.endDate = { not: null };
    }

    const history = await this.prisma.organization.findMany({
      where,
      include: {
        parent: { select: { name: true } },
        employee: { select: { nameKr: true, jobRole: true } },
        /* [임시 주석]
        projects: isScheduled
          ? {
              where: {
                OR: [{ endDate: null }, { endDate: { gte: now } }],
              },
            }
          : false,
        */
      },
      orderBy: isScheduled ? { startDate: 'asc' } : { startDate: 'desc' },
    });

    return history.map((org: any) => {
      const isClosed = org.endDate && org.endDate <= now;
      const common = {
        id: org.id,
        name: org.name,
        parentName: org.parent?.name ?? '최상위',
        type: isClosed || (isScheduled && org.endDate) ? '폐지' : '신설',
      };

      if (isScheduled) {
        return {
          ...common,
          applyDate: org.endDate && org.endDate > now ? org.endDate : org.startDate,
          desc: org.desc,
          projects: [],
          members: org.employee.map((e: any) => `${e.nameKr}(${e.jobRole})`),
          regTime: org.regTime,
        };
      } else {
        return {
          ...common,
          applyDate: isClosed ? org.endDate : org.startDate,
          memberCount: org.employee.length,
        };
      }
    });
  }
}
