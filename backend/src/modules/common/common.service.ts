import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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
              is: {
                hrStatus: 'EMPLOYED',
              },
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

  async getOrganizationChart(includeMembers: boolean): Promise<OrgChartDto[]> {
    try {
      const startOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
      const endOfToday = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999);

      const rawOrgs = await this.prisma.organization.findMany({
        where: {
          AND: [{ startDate: { lte: endOfToday } }, { endDate: { gt: startOfToday } }],
        },
        include: {
          projects: {
            where: {
              status: { in: ['IN_PROGRESS', 'PLANNED'] },
            },
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

    if (!department) {
      throw new NotFoundException(`부서 ID ${deptId}를 찾을 수 없습니다.`);
    }

    return department.children;
  }

  // 🌟 DB 스키마(1번 코드 베이스)에 맞게 jobPosition과 jobTitle 유지
  async findMembersByTeam(teamId: number) {
    const members = await this.prisma.employee.findMany({
      where: {
        teamId: teamId,
        employeeDetail: {
          // 🌟 해결: 관계형 데이터 검색을 위해 'is' 키워드 추가
          is: {
            hrStatus: 'EMPLOYED',
          },
        },
      },
      select: {
        id: true,
        nameKr: true,
        jobPosition: true,
        jobRole: true,
        jobTitle: true,
        department: {
          select: { name: true },
        },
        team: {
          select: { name: true },
        },
      },
      orderBy: {
        nameKr: 'asc',
      },
    });

    return members.map((m) => ({
      id: m.id,
      name: m.nameKr,
      jobTitle: m.jobTitle ? `${m.jobPosition}(${m.jobTitle})` : m.jobPosition || '사원',
      parentName: m.department?.name || '',
      teamName: m.team?.name || '',
    }));
  }

  // ===========================================================================
  // [Section 2] 공통 코드(Common Code)
  // ===========================================================================

  async getCodesByType(type: string) {
    return this.prisma.commonCode.findMany({
      where: { type },
      orderBy: { id: 'asc' },
    });
  }

  async getCodesByTypes(types: string[]) {
    return this.prisma.commonCode.findMany({
      where: {
        type: { in: types },
        isUsed: true,
      },
      select: {
        type: true,
        code: true,
        name: true,
        attr1: true,
      },
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

  // 🌟 2번 코드의 안전장치(시퀀스 강제 동기화) 추가됨
  async createCode(dto: { type: string; code: string; name: string; description?: string }) {
    if (!dto.type || !dto.code) {
      throw new BadRequestException('유형(type)과 코드(code)는 필수입니다.');
    }

    const exists = await this.prisma.commonCode.findFirst({
      where: {
        type: dto.type,
        code: dto.code,
      },
    });

    if (exists) {
      throw new ConflictException('이미 해당 타입 내에 존재하는 코드입니다.');
    }

    // [핵심] 시퀀스 동기화 (빈 테이블 에러 방지를 위해 COALESCE 적용)
    try {
      await this.prisma.$executeRawUnsafe(`
        SELECT setval('common_code_id_seq', COALESCE((SELECT MAX(id) FROM "common_code"), 1));
      `);
    } catch (e) {
      console.log('⚠️ 시퀀스 조정 실패 (무시 가능):', e instanceof Error ? e.message : e);
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
      data: {
        code: dto.code,
        name: dto.name,
        attr1: dto.description,
      },
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

  // 🌟 기존 로직 유지 + 빈 테이블 고려한 COALESCE 추가
  async createCategory(dto: { categoryCode: string; firstCode: string; firstName: string; firstDesc?: string }) {
    if (!dto.categoryCode) {
      console.log('❌ [ERROR] categoryCode가 없습니다!');
      throw new BadRequestException('유형 코드가 전달되지 않았습니다.');
    }

    console.log(`🔎 [DB 검색] type이 '${dto.categoryCode}'인 데이터 찾는 중...`);

    const exists = await this.prisma.commonCode.findFirst({
      where: { type: dto.categoryCode },
    });

    if (exists) {
      console.log('⚠️ [CONFLICT] 이미 존재함 판정 -> 409 에러 발생');
      throw new ConflictException(`이미 존재하는 유형 코드입니다: ${dto.categoryCode}`);
    }

    console.log('✅ [PASS] 중복 없음. 생성 시작...');

    // [핵심] 시퀀스 동기화 (빈 테이블 에러 방지를 위해 COALESCE 적용)
    try {
      await this.prisma.$executeRawUnsafe(`
        SELECT setval('common_code_id_seq', COALESCE((SELECT MAX(id) FROM "common_code"), 1));
      `);
      console.log('🔧 [FIX] ID 시퀀스(번호표) 동기화 완료');
    } catch (e) {
      console.log('⚠️ 시퀀스 조정 실패 (무시 가능):', e instanceof Error ? e.message : e);
    }

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