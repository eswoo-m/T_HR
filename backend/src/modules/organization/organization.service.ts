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

    // 2. 조직 생성
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
        projects: {
          where: {
            OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
          },
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
        _count: {
          select: { employee: true },
        },
      },
    });

    if (!org) throw new NotFoundException('조직을 찾을 수 없습니다.');

    return {
      id: org.id,
      name: org.name,
      memberCount: org.employee.length,
      activeProject: (() => {
        const allProjects = [...(org.projects ?? [])];
        if (allProjects.length === 0) return null;

        const p = allProjects[0]; // 가장 최근 또는 첫 번째 프로젝트
        return {
          id: p.id,
          name: p.name,
          period: `${p.startDate ? p.startDate.toISOString().split('T')[0] : ''} ~ ${p.endDate ? p.endDate.toISOString().split('T')[0] : '진행중'}`,
        };
      })(),

      // 하위 조직 리스트
      subOrganizations: org.children.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.desc || '',
      })),

      // 소속 멤버 리스트 (nameKr 필드 사용)
      members: org.employee.map((e) => ({
        id: e.id,
        name: e.nameKr, // 스키마의 nameKr 필드와 매칭
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
      // 1. 기존 부서 정보 조회 및 존재 여부 확인
      const oldOrg = await tx.organization.findUnique({
        where: { id },
        include: {
          employee: true,
          projects: {
            where: {
              OR: [
                { endDate: null }, // 종료일이 설정되지 않았거나
                { endDate: { gte: toSafeDate(targetDate) } }, // 종료일이 부서 변경/삭제일보다 크거나 같은 경우
              ],
            },
          },
        },
      });

      if (!oldOrg) throw new NotFoundException('해당 부서를 찾을 수 없습니다.');
      if (oldOrg.projects && oldOrg.projects.length > 0) {
        const projectNames = oldOrg.projects.map((p) => p.name).join(', ');
        throw new BadRequestException(`진행 중인 프로젝트(${projectNames})가 있어 처리가 불가능합니다.`);
      }

      const targetParentId = parentId ?? oldOrg.parentId;

      try {
        // [CASE 1] 부서명 변경 (이력 관리형 업데이트)
        if (name) {
          // 1-1. 기존 부서 종료일 업데이트 (변경일 - 1일)
          await tx.organization.update({
            where: { id },
            data: { endDate: subtractDaysSafe(targetDate, 1) },
          });

          // 1-2. 신규 부서 생성 (시작일 = 변경일)
          const newOrg = await tx.organization.create({
            data: {
              name,
              parentId: parentId ?? oldOrg.parentId,
              startDate: toSafeDate(targetDate),
              desc: desc ?? oldOrg.desc,
            },
          });

          // 1-3. 구성원 부서 이동 및 이력 생성
          for (const emp of oldOrg.employee) {
            await tx.employeeOrganizationHistory.create({
              data: {
                employeeId: emp.id,
                departmentId: parentId ?? (oldOrg.parentId || newOrg.id), // 상위가 있으면 상위, 없으면 본인
                teamId: parentId ? newOrg.id : null, // 상위가 있으면 본인은 팀
                applyDate: toSafeDate(targetDate),
                jobLevel: emp.jobLevel,
                jobRole: emp.jobRole,
              },
            });
          }

          return { message: '부서 정보가 변경되어 신규 부서가 생성되었습니다.', newId: newOrg.id };
        }
        // [CASE 2] 부서 삭제 (종료 처리)
        else {
          // 2-1. 해당 부서 종료일 업데이트
          await tx.organization.update({
            where: { id },
            data: { endDate: toSafeDate(targetDate) },
          });

          // 2-2. 구성원을 상위 부서로 이동 (상위 부서가 없으면 null 혹은 최상위 처리)
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
        // 트랜잭션 내부에서 발생한 예상치 못한 에러 처리 (ESLint 에러 해결)
        const message = error instanceof Error ? error.message : 'DB 처리 중 오류 발생';
        throw new InternalServerErrorException(message);
      }
    });
  }

  async getOrganizationHistory(dto: GetOrganizationHistoryDto) {
    const { searchKeyword, startDate, endDate, type, tab } = dto;
    const now = new Date();
    const isScheduled = tab === 'scheduled';

    // 1. 기본 필터 설정 (탭에 따른 과거/예정 구분)
    const where: Prisma.OrganizationWhereInput = {};

    if (isScheduled) {
      // [예정 탭]: 시작일이 미래이거나 종료일이 미래인 경우
      where.OR = [{ startDate: { gt: now } }, { endDate: { gt: now } }];
    } else {
      // [과거 탭]: 이미 시작되었거나 이미 종료된 경우
      where.OR = [{ startDate: { lte: now } }, { endDate: { lte: now, not: null } }];
    }

    // 2. 검색어 필터
    if (searchKeyword) {
      where.name = { contains: searchKeyword };
    }

    // 3. 기간 검색 (Unused vars 에러 해결)
    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // 4. 변경 유형 필터 (Enum 비교 에러 해결)
    if (type === OrgChangeType.NEW) {
      where.endDate = null;
    } else if (type === OrgChangeType.CLOSE) {
      where.endDate = { not: null };
    }

    // 5. DB 조회 (예정 탭일 경우 상세 정보 포함)
    const history = await this.prisma.organization.findMany({
      where,
      include: {
        parent: { select: { name: true } },
        employee: { select: { nameKr: true, jobRole: true } },
        projects: isScheduled
          ? {
              where: {
                OR: [{ endDate: null }, { endDate: { gte: now } }],
              },
            }
          : false,
      },
      orderBy: isScheduled ? { startDate: 'asc' } : { startDate: 'desc' },
    });

    // 6. 데이터 가공 및 반환
    return history.map((org) => {
      const isClosed = org.endDate && org.endDate <= now;
      const common = {
        id: org.id,
        name: org.name,
        parentName: org.parent?.name ?? '최상위',
        type: isClosed || (isScheduled && org.endDate) ? '폐지' : '신설',
      };

      if (isScheduled) {
        // [예정된 조직 변경 리스트 응답]
        return {
          ...common,
          applyDate: org.endDate && org.endDate > now ? org.endDate : org.startDate, // 적용예정일
          desc: org.desc,
          projects:
            org.projects?.map((p) => ({
              // Prettier 괄호 적용
              name: p.name,
              startDate: p.startDate,
              endDate: p.endDate,
            })) || [],
          members: org.employee.map((e) => `${e.nameKr}(${e.jobRole})`),
          regTime: org.regTime,
        };
      } else {
        // [과거 조직변경 이력 리스트 응답]
        return {
          ...common,
          applyDate: isClosed ? org.endDate : org.startDate, // 적용일
          memberCount: org.employee.length, // 구성원수
        };
      }
    });
  }
}
