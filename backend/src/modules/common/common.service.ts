import { Injectable, NotFoundException, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Prisma } from '@prisma/client';
import { TeamStructureDto } from 'src/modules/common/dto/team-structure.dto';
import { OrgChartDto } from 'src/modules/common/dto/org-chart.dto';
import { formatDate } from '@common/utils/date.util';

// interface OrganizationWithChildren extends Organization {
//   level: number;
//   children?: OrganizationWithChildren[];
//   employee?: any[];
// }

// type OrganizationWithMembers = Prisma.OrganizationGetPayload<{
//   include: {
//     employee: {
//       select: { id: true; nameKr: true; jobRole: true };
//     };
//   };
// }>;

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
        // 1. 하위 팀(Children) 조회
        children: {
          select: {
            id: true,
            name: true,
            _count: { select: { employee: true } },
          },
        },
        // 2. 소속 구성원(Employees) 조회
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

      // 1. 조직 조회
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

      // 2. 직원 조회 (현 소속 조직 = deptId)
      const employees = includeMembers
        ? await this.prisma.employee.findMany({
            where: {
              deptId: { not: null },
              employeeDetail: { is: { hrStatus: 'EMPLOYED' } }, // 재직중
            },
            select: {
              id: true,
              nameKr: true,
              jobRole: true,
              deptId: true,
            },
          })
        : [];

      // 3. deptId 기준 직원 Map 생성 (string key로 통일)
      const empMap = new Map<string, typeof employees>();
      employees.forEach((emp) => {
        if (!emp.deptId) return;
        const key = String(emp.deptId);
        if (!empMap.has(key)) empMap.set(key, []);
        empMap.get(key)!.push(emp);
      });

      // 4. 조직 Map 생성 (string key)
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

      // 5. 조직 트리 구성
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

      // 6. level 계산 (재귀)
      const setLevel = (nodes: OrgChartDto[], level: number) => {
        nodes.forEach((node) => {
          node.level = level;
          if (node.children && node.children.length > 0) {
            setLevel(node.children, level + 1);
          }
        });
      };
      setLevel(rootNodes, 1);

      // // 7. 디버그 로그 (직원 Map 확인용)
      // if (includeMembers) {
      //   // console.log('=== Employee Map ===');
      //   empMap.forEach((emps, deptId) => {
      //     console.log(
      //       `deptId: ${deptId}, employees:`,
      //       emps.map((e) => e.nameKr),
      //     );
      //   });
      // }

      return rootNodes;
    } catch (error: unknown) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : '조직도 조회 중 오류');
    }
  }

  // 팀 목록: 선택된 부서 ID로 필터링
  async getRootOrganizations() {
    return this.prisma.organization.findMany({
      where: { parentId: { not: null }, parent: { parentId: null } },
      // where: {
      //   // 1. 최상위(회사) 제외
      //   parentId: { not: null },
      //   // 2. 하위 조직(팀 또는 하부서)이 하나라도 존재하는 경우만 조회
      //   children: {
      //     some: {},
      //   },
      // },
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
        jobLevel: true,
        jobRole: true,
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
      jobRole: m.jobRole ? `${m.jobLevel}(${m.jobRole})` : m.jobLevel || '사원',
      parentName: m.department?.name || '',
      teamName: m.team?.name || '',
    }));
  }

  // ===========================================================================
  // [Section 2] 공통 코드(Common Code)
  // ===========================================================================

  /**
   * 특정 카테고리(type)의 코드 목록 조회
   * 예: getCodesByType('RANK') -> 대리, 과장, 차장...
   * (시스템 관리에서 볼 때는 isUsed false인 것도 봐야 하므로 필터 제거 - 2번 코드 반영)
   */
  async getCodesByType(type: string) {
    return this.prisma.commonCode.findMany({
      where: { 
        type,
        // isUsed: true, // 사용 중인 코드만 필터링 (주석 처리됨)
      },
      // select: {
      //   type: true,
      //   code: true,
      //   name: true,
      //   attr1: true,
      // },
      orderBy: { id: 'asc' }, // 혹은 정렬용 별도 컬럼이 있다면 그것을 사용
    });
  }

  /**
   * 여러 타입의 코드를 한 번에 조회 (화면 초기 로딩 최적화용)
   */
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
      categoryName: group.type, // 매핑 테이블 부재로 type을 이름으로 사용 (프론트에서 한글 매핑)
      description: `총 ${group._count.code}개의 코드`,
      isActive: true,
      createdDate: new Date().toISOString(),
    }));
  }

  async createCode(dto: { type: string; code: string; name: string; description?: string }) {
    // [추가됨] 방어 코드: 필수값 체크
    if (!dto.type || !dto.code) {
      throw new BadRequestException('유형(type)과 코드(code)는 필수입니다.');
    }

    // 중복 체크
    const exists = await this.prisma.commonCode.findFirst({
      where: {
        type: dto.type,
        code: dto.code,
      },
    });

    if (exists) {
      throw new ConflictException('이미 해당 타입 내에 존재하는 코드입니다.');
    }

    // 🌟 [핵심 추가] DB 번호표(Sequence) 꼬임 방지를 위한 시퀀스 강제 동기화
    try {
      await this.prisma.$executeRawUnsafe(`
        SELECT setval('common_code_id_seq', COALESCE((SELECT MAX(id) FROM "common_code"), 1));
      `);
    } catch (e) {
      console.log('⚠️ 시퀀스 조정 실패 (무시 가능):', e instanceof Error ? e.message : e);
    }

    // 실제 데이터 생성
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

  async createCategory(dto: { categoryCode: string; firstCode: string; firstName: string; firstDesc?: string }) {
    
    // 방어 로직
    if (!dto.categoryCode) {
      console.log('❌ [ERROR] categoryCode가 없습니다!');
      throw new BadRequestException('유형 코드가 전달되지 않았습니다.');
    }

    // 1. 이미 존재하는 유형인지 확인
    console.log(`🔎 [DB 검색] type이 '${dto.categoryCode}'인 데이터 찾는 중...`);
    
    const exists = await this.prisma.commonCode.findFirst({
      where: { type: dto.categoryCode },
    });

    console.log('📄 [DB 검색 결과]:', exists); 

    if (exists) {
      console.log('⚠️ [CONFLICT] 이미 존재함 판정 -> 409 에러 발생');
      throw new ConflictException(`이미 존재하는 유형 코드입니다: ${dto.categoryCode}`);
    }

    console.log('✅ [PASS] 중복 없음. 생성 시작...');

    // 🚨 [핵심 수정] DB 번호표(Sequence)가 꼬였을 때를 대비해 강제로 동기화
    try {
      await this.prisma.$executeRawUnsafe(`
        SELECT setval('common_code_id_seq', (SELECT MAX(id) FROM "common_code"));
      `);
      console.log('🔧 [FIX] ID 시퀀스(번호표) 동기화 완료');
    } catch (e) {
      // 테이블이 비어있거나 권한 문제 등은 무시 (보통은 위 쿼리로 해결됨)
      console.log('⚠️ 시퀀스 조정 실패 (무시 가능):', e instanceof Error ? e.message : e);
    }

    // 2. 생성 시도
    const result = await this.prisma.commonCode.create({
      data: {
        type: dto.categoryCode,    
        code: dto.firstCode,       
        name: dto.firstName,       
        attr1: dto.firstDesc,      
        isUsed: true,
      },
    });
    
    return result;
  }
}