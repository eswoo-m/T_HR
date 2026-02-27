import { Injectable, NotFoundException, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamStructureDto } from 'src/modules/common/dto/team-structure.dto';
import { OrgChartDto } from 'src/modules/common/dto/org-chart.dto';
import { formatDate } from '@common/utils/date.util';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // [Section 1] 조직(Organization) 및 팀 구조 관련 로직
  // ===========================================================================

  /**
   * 특정 팀의 하위 구조와 소속 멤버를 조회 (기존 기능 유지)
   */
  async getOrganizationStructure(teamId: number): Promise<TeamStructureDto> {
    const team = await this.prisma.organization.findUnique({
      where: { id: teamId },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            _count: { select: { employee: true } },
          },
        },
        employee: {
          where: {
            employeeDetail: {
              hrStatus: 'EMPLOYED',
            },
          },
          select: {
            id: true,
            nameKr: true,
            jobRole: true,
            email: true,
            phone: true,
          },
          orderBy: { nameKr: 'asc' },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`ID가 ${teamId}인 팀을 찾을 수 없습니다.`);
    }

    return {
      id: team.id,
      name: team.name,
      subTeams: team.children.map((child) => ({
        id: child.id,
        name: child.name,
        employeeCount: child._count.employee,
      })),
      members: team.employee.map((emp) => ({
        id: Number(emp.id),
        name: emp.nameKr,
        jobRole: emp.jobRole ?? '',
        email: emp.email ?? '',
        phone: emp.phone ?? '',
      })),
    };
  }

  /**
   * 전사 조직도 트리 구성 및 레벨 계산 (기존 로직 유지)
   */
  async getOrganizationChart(includeMembers: boolean): Promise<OrgChartDto[]> {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const rawOrgs = await this.prisma.organization.findMany({
        where: {
          AND: [{ startDate: { lte: endOfToday } }, { endDate: { gt: startOfToday } }],
        },
        include: {
          projects: {
            where: { status: { in: ['IN_PROGRESS', 'PLANNED'] } },
            take: 1,
            orderBy: { startDate: 'desc' },
          },
        },
      });

      const employees = includeMembers
        ? await this.prisma.employee.findMany({
            where: {
              deptId: { not: null },
              employeeDetail: { is: { hrStatus: 'EMPLOYED' } },
            },
            select: {
              id: true,
              nameKr: true,
              jobRole: true,
              deptId: true,
            },
          })
        : [];

      const empMap = new Map<string, typeof employees>();
      employees.forEach((emp) => {
        if (!emp.deptId) return;
        const key = String(emp.deptId);
        if (!empMap.has(key)) empMap.set(key, []);
        empMap.get(key)!.push(emp);
      });

      const orgMap = new Map<string, OrgChartDto>();
      rawOrgs.forEach((org) => {
        const currentProject = org.projects?.[0] || null;

        const node: OrgChartDto = {
          id: org.id,
          name: org.name,
          level: 0,
          description: org.desc || '',
          regDate: formatDate(org.regTime) || '',
          children: [],
          activeProject: currentProject
            ? {
                name: currentProject.name,
                period: `${formatDate(currentProject.startDate)} ~ ${formatDate(currentProject.endDate)}`,
              }
            : null,
          members: includeMembers
            ? (empMap.get(String(org.id)) ?? []).map((emp) => ({
                id: emp.id,
                name: emp.nameKr,
                jobRole: emp.jobRole ?? '',
                department: org.name ?? '',
              }))
            : undefined,
        };
        orgMap.set(String(org.id), node);
      });

      const rootNodes: OrgChartDto[] = [];
      rawOrgs.forEach((org) => {
        const currentNode = orgMap.get(String(org.id))!;
        if (org.parentId === null) {
          rootNodes.push(currentNode);
        } else {
          const parentNode = orgMap.get(String(org.parentId));
          if (parentNode) {
            parentNode.children!.push(currentNode);
          }
        }
      });

      const setLevel = (nodes: OrgChartDto[], level: number) => {
        nodes.forEach((node) => {
          node.level = level;
          if (node.children && node.children.length > 0) {
            setLevel(node.children, level + 1);
          }
        });
      };
      setLevel(rootNodes, 1);

      return rootNodes;
    } catch (error: unknown) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : '조직도 조회 중 오류');
    }
  }

  async getRootOrganizations() {
    return this.prisma.organization.findMany({
      where: { parentId: { not: null }, parent: { parentId: null } },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  async getSubOrganizations(deptId: number) {
    const department = await this.prisma.organization.findUnique({
      where: { id: deptId },
      select: {
        children: {
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!department) throw new NotFoundException(`부서 ID ${deptId}를 찾을 수 없습니다.`);
    return department.children;
  }

  /**
   * [중요] 팀원 찾기 기능 (기존 조합 로직 유지 + 스키마 필드 교정)
   */
  async findMembersByTeam(teamId: number) {
    const members = await this.prisma.employee.findMany({
      where: {
        teamId: teamId,
        employeeDetail: {
          hrStatus: 'EMPLOYED',
        },
      },
      select: {
        id: true,
        nameKr: true,
        jobPosition: true, // jobLevel 대신 실존하는 jobPosition 사용
        jobTitle: true,    // 기존 스키마에 존재함
        jobRole: true,     // 기존 스키마에 존재함
        department: { select: { name: true } },
        team: { select: { name: true } },
      },
      orderBy: { nameKr: 'asc' },
    });

    return members.map((m) => ({
      id: m.id,
      name: m.nameKr,
      // 기존 기능: jobLevel(jobRole) 형태의 문자열 조합 유지
      // jobLevel 대신 jobPosition을 사용하여 에러 해결
      jobTitle: m.jobRole ? `${m.jobPosition || '사원'}(${m.jobRole})` : m.jobPosition || '사원',
      parentName: m.department?.name || '',
      teamName: m.team?.name || '',
    }));
  }

  // ===========================================================================
  // [Section 2] 공통 코드(Common Code) - 모든 생성/수정/조회 기능 유지
  // ===========================================================================

  async getCodesByType(type: string) {
    return this.prisma.commonCode.findMany({
      where: { type },
      orderBy: { id: 'asc' },
    });
  }

  async getCodesByTypes(types: string[]) {
    return this.prisma.commonCode.findMany({
      where: { type: { in: types }, isUsed: true },
      select: { type: true, code: true, name: true, attr1: true },
      orderBy: { id: 'asc' },
    });
  }

  async getCodeCategories() {
    const grouped = await this.prisma.commonCode.groupBy({
      by: ['type'],
      _count: { code: true },
      orderBy: { type: 'asc' },
    });

    return grouped.map((group) => ({
      id: group.type,
      categoryCode: group.type,
      categoryName: group.type,
      description: `총 ${group._count.code}개의 코드`,
      isActive: true,
      createdDate: new Date().toISOString(),
    }));
  }

  async createCode(dto: { type: string; code: string; name: string; description?: string }) {
    if (!dto.type || !dto.code) throw new BadRequestException('유형(type)과 코드(code)는 필수입니다.');

    const exists = await this.prisma.commonCode.findFirst({
      where: { type: dto.type, code: dto.code },
    });

    if (exists) throw new ConflictException('이미 해당 타입 내에 존재하는 코드입니다.');

    try {
      await this.prisma.$executeRawUnsafe(`
        SELECT setval('common_code_id_seq', COALESCE((SELECT MAX(id) FROM "common_code"), 1), false);
      `);
    } catch (e) {
      console.warn('⚠️ 시퀀스 동기화 무시:', e);
    }

    return this.prisma.commonCode.create({
      data: {
        type: dto.type,
        code: dto.code,
        name: dto.name,
        attr1: dto.description,
        isUsed: true,
      },
    });
  }

  async updateCode(id: number, dto: { code: string; name: string; description?: string }) {
    const codeItem = await this.prisma.commonCode.findUnique({ where: { id } });
    if (!codeItem) throw new NotFoundException('코드를 찾을 수 없습니다.');

    return this.prisma.commonCode.update({
      where: { id },
      data: { code: dto.code, name: dto.name, attr1: dto.description },
    });
  }

  async toggleCodeStatus(id: number) {
    const codeItem = await this.prisma.commonCode.findUnique({ where: { id } });
    if (!codeItem) throw new NotFoundException('코드를 찾을 수 없습니다.');

    return this.prisma.commonCode.update({
      where: { id },
      data: { isUsed: !codeItem.isUsed },
    });
  }

  async createCategory(dto: { categoryCode: string; firstCode: string; firstName: string; firstDesc?: string }) {
    const exists = await this.prisma.commonCode.findFirst({
      where: { type: dto.categoryCode },
    });

    if (exists) throw new ConflictException(`이미 존재하는 유형 코드입니다: ${dto.categoryCode}`);

    return this.prisma.commonCode.create({
      data: {
        type: dto.categoryCode,
        code: dto.firstCode,
        name: dto.firstName,
        attr1: dto.firstDesc,
        isUsed: true,
      },
    });
  }
}