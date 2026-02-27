import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseDate, toSafeDate, subtractDaysSafe, formatDate, DB_MAX_DATE } from '@common/utils/date.util';
import { OrganizationDetailResponseDto } from './dto/organization-detail-response.dto';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrgHistoryResponse } from '@modules/organization/dto/organization-history-response';
import dayjs from 'dayjs';
import { UpdateOrganizationScheduledDto } from '@modules/organization/dto/update-organization-scheduled.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async registerOrganization(dto: RegisterOrganizationDto) {
    const { name, startDate, parentId, description } = dto;

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
        desc: description || null,
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
            status: {
              in: ['IN_PROGRESS', 'PLANNED'],
            },
          },
          take: 1,
          orderBy: { startDate: 'desc' },
        },
        _count: {
          select: { employee: true },
        },
      },
    });

    if (!org) throw new NotFoundException('조직을 찾을 수 없습니다.');
    const currentProject = org.projects?.[0] || null;

    return {
      id: org.id,
      name: org.name,
      memberCount: org._count.employee,
      activeProject: currentProject
        ? {
            name: currentProject.name,
            period: `${formatDate(currentProject.startDate)} ~ ${formatDate(currentProject.endDate)}`,
          }
        : null,
      description: org.desc ?? '',
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
        desc: dto.description,
      },
    });
  }

  async handleOrganizationChange(id: number, dto: RegisterOrganizationDto) {
    const { startDate, name, parentId, description } = dto;
    const targetDate = parseDate(startDate);

    if (!targetDate) {
      throw new BadRequestException('적용 일자(regDate) 형식이 올바르지 않거나 비어있습니다.');
    }

    return this.prisma.$transaction(async (tx) => {
      const oldOrg = await tx.organization.findUnique({
        where: { id },
        include: { employee: true },
      });

      if (!oldOrg) throw new NotFoundException('해당 부서를 찾을 수 없습니다.');

      const activeProjects = await tx.project.findMany({
        where: {
          teamId: id,
          OR: [{ endDate: null }, { endDate: { gte: toSafeDate(targetDate) } }],
        },
      });
      if (activeProjects.length > 0) {
        const names = activeProjects.map((p) => p.name).join(', ');
        throw new BadRequestException(`진행 중인 프로젝트(${names})가 있어 개편이 불가능합니다.`);
      }

      const memberIds = oldOrg.employee.map((emp) => emp.id);
      const applyDate = toSafeDate(targetDate);

      try {
        await tx.organization.update({
          where: { id },
          data: {
            endDate: subtractDaysSafe(targetDate, 1),
          },
        });

        const newOrg = await tx.organization.create({
          data: {
            name,
            parentId: parentId ?? oldOrg.parentId,
            startDate: toSafeDate(targetDate),
            desc: description ?? oldOrg.desc,
          },
        });

        await tx.organization.updateMany({
          where: { parentId: id },
          data: { parentId: newOrg.id },
        });

        if (memberIds.length > 0) {
          await this.transferEmployeesWithHistory(tx, memberIds, newOrg.id, applyDate);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'DB 처리 중 알 수 없는 오류 발생';
        throw new InternalServerErrorException(errorMessage);
      }
    });
  }

  async terminate(id: number, exitDate: string) {
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.findUnique({
        where: { id },
        include: { employee: { select: { id: true } } },
      });

      if (!org || !org.parentId) throw new BadRequestException('폐지할 수 없는 조직입니다. 🛡️');

      const exitDateObj = new Date(exitDate);
      const applyDate = new Date(exitDateObj);
      applyDate.setDate(exitDateObj.getDate() + 1);

      const memberIds = org.employee.map((emp) => emp.id);

      if (memberIds.length > 0) {
        await this.transferEmployeesWithHistory(tx, memberIds, org.parentId, applyDate);
      }

      return tx.organization.update({
        where: { id },
        data: { endDate: exitDateObj },
      });
    });
  }

  async getOrganizationHistory() {
    const today = dayjs().startOf('day').toDate();

    const allOrgs = await this.prisma.organization.findMany({
      include: {
        parent: true,
        historiesAsTeam: {
          include: {
            employee: true,
          },
        },
        projects: {
          where: { status: { in: ['IN_PROGRESS', 'PLANNED'] } },
          take: 1,
          orderBy: { startDate: 'desc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    const history: OrgHistoryResponse[] = [];
    const scheduled: OrgHistoryResponse[] = [];

    allOrgs.forEach((org) => {
      const currentProject = org.projects?.[0] || null;

      const mapOrgToEntry = (type: '신설' | '폐지', date: Date): OrgHistoryResponse => {
        const targetHistory = org.historiesAsTeam || [];

        return {
          id: String(org.id),
          date: date,
          displayDate: formatDate(date),
          type: type,
          category: 'org',
          organization: org.name,
          department: org.parent?.name || '최상위 조직',
          description: type === '신설' ? org.desc || '신규 조직 신설' : '조직 개편에 따른 팀 해체',
          headCountBefore: type === '신설' ? 0 : targetHistory.length,
          headCountAfter: type === '신설' ? targetHistory.length : 0,
          registeredDate: formatDate(org.regTime),

          projectId: currentProject?.id,
          projectName: currentProject?.name || '',
          projectPeriod: currentProject ? `${formatDate(currentProject.startDate)} ~ ${formatDate(currentProject.endDate)}` : '',

          // 🌟 수정: jobPosition, jobTitle 대신 jobLevel, jobRole 사용
          members: targetHistory.map((h: any) => ({
            name: h.employee.nameKr,
            position: h.jobLevel || h.jobRole || '팀원',
          })),
        };
      };

      const newEntry = mapOrgToEntry('신설', org.startDate);
      if (dayjs(org.startDate).isAfter(today)) {
        scheduled.push(newEntry);
      } else {
        history.push(newEntry);
      }

      if (org.endDate && dayjs(org.endDate).isBefore(DB_MAX_DATE)) {
        const closeEntry = mapOrgToEntry('폐지', org.endDate);
        if (dayjs(org.endDate).isAfter(today)) {
          scheduled.push(closeEntry);
        } else {
          history.push(closeEntry);
        }
      }
    });

    return {
      history: history.sort((a, b) => dayjs(b.date).diff(dayjs(a.date))),
      scheduled: scheduled.sort((a, b) => dayjs(a.date).diff(dayjs(b.date))),
    };
  }

  async updateMembersDepartment(memberIds: string[], targetDeptId: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await this.transferEmployeesWithHistory(tx, memberIds, targetDeptId, new Date());

        return {
          success: true,
          count: memberIds.length,
          message: `부서 이동 및 이력 생성이 완료되었습니다.`,
        };
      });
    } catch (error: any) {
      console.error('부서 이동 트랜잭션 에러:', error);
      throw new InternalServerErrorException('부서 이동 처리 중 오류 발생');
    }
  }

  async updateScheduledChange(id: number, dto: UpdateOrganizationScheduledDto) {
    const existingOrg = await this.prisma.organization.findUnique({ where: { id } });
    if (!existingOrg) throw new NotFoundException('조직 데이터를 찾을 수 없습니다.');

    let parentIdNumber: number | null = null;
    if (dto.department && dto.department !== '최상위 조직') {
      const parentOrg = await this.prisma.organization.findFirst({
        where: { name: dto.department },
      });

      if (!parentOrg) {
        throw new BadRequestException(`상위 조직 '${dto.department}'을 찾을 수 없습니다. ㅋ`);
      }
      parentIdNumber = parentOrg.id;
    }

    return this.prisma.$transaction(async (tx) => {
      const applyDate = new Date(dto.date);

      const updateData: Partial<any> = {
        name: dto.organization,
        parentId: parentIdNumber,
        desc: dto.description || '',
      };

      if (dto.type === '신설') {
        updateData.startDate = parseDate(dto.date);
        updateData.endDate = null;
      } else if (dto.type === '폐지') {
        updateData.endDate = parseDate(dto.date);
      }

      const updatedOrg = await tx.organization.update({
        where: { id },
        data: updateData,
      });

      if (dto.projectId && dto.projectId !== 0) {
        await tx.project.updateMany({
          where: { teamId: id },
          data: { teamId: null },
        });

        await tx.project.update({
          where: { id: dto.projectId },
          data: { teamId: id },
        });
      } else if (dto.projectId === 0) {
        await tx.project.updateMany({
          where: { teamId: id },
          data: { teamId: null },
        });
      }

      if (dto.members) {
        const currentMemberIds = dto.members.map((m) => String(m.id));

        await tx.employeeOrganizationHistory.deleteMany({
          where: {
            teamId: id,
            applyDate: applyDate,
          },
        });

        if (currentMemberIds.length > 0) {
          const memberIdStrings = currentMemberIds.map(String);
          await this.transferEmployeesWithHistory(tx, memberIdStrings, id, applyDate);
        }
      }

      return updatedOrg;
    });
  }

  private async transferEmployeesWithHistory(tx: Prisma.TransactionClient, memberIds: string[], targetDeptId: number, applyDate: Date) {
    if (memberIds.length === 0) return;

    const targetDept = await tx.organization.findUnique({
      where: { id: targetDeptId },
      select: { id: true, parentId: true },
    });
    if (!targetDept) throw new NotFoundException('대상 부서를 찾을 수 없습니다.');

    // 🌟 수정: jobPosition, jobTitle 대신 jobLevel, jobRole 조회
    const currentEmployees = await tx.employee.findMany({
      where: { id: { in: memberIds } },
      select: { id: true, jobLevel: true, jobRole: true },
    });

    // 🌟 수정: 이력(History) 테이블 생성 시 jobLevel, jobRole 매핑
    await tx.employeeOrganizationHistory.createMany({
      data: currentEmployees.map((emp: any) => ({
        employeeId: emp.id,
        departmentId: targetDept.parentId ?? targetDeptId,
        teamId: targetDeptId,
        jobLevel: emp.jobLevel,
        jobRole: emp.jobRole,
        applyDate: applyDate,
        memo: '조직 개편/폐지에 따른 자동 이동 예약',
      })),
    });
  }
}