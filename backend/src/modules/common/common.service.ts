import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
      // 1. 조직 조회
      const rawOrgs = await this.prisma.organization.findMany();

      // 2. 직원 조회 (현 소속 조직 = deptId)
      const employees = includeMembers
        ? await this.prisma.employee.findMany({
            where: {
              deptId: { not: null }, // deptId가 있는 직원만
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
        const node: OrgChartDto = {
          id: org.id,
          name: org.name,
          level: 0,
          description: org.desc || '',
          regDate: formatDate(org.regTime) || '',
          children: [],
          members: includeMembers
            ? (empMap.get(String(org.id)) ?? []).map((emp) => ({
                id: emp.id,
                nameKr: emp.nameKr,
                jobRole: emp.jobRole ?? '',
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

      // 7. 디버그 로그 (직원 Map 확인용)
      if (includeMembers) {
        // console.log('=== Employee Map ===');
        empMap.forEach((emps, deptId) => {
          console.log(
            `deptId: ${deptId}, employees:`,
            emps.map((e) => e.nameKr),
          );
        });
      }

      return rootNodes;
    } catch (error: unknown) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : '조직도 조회 중 오류');
    }
  }

  // 조직도
  // async getOrganizationChart(includeMembers: boolean): Promise<OrgChartDto[]> {
  //   try {
  //     const rawOrgs = await this.prisma.organization.findMany({
  //       include: {
  //         employee: includeMembers
  //           ? {
  //               where: { employeeDetail: { is: { hrStatus: 'EMPLOYED' } } },
  //               select: { id: true, nameKr: true, jobRole: true },
  //             }
  //           : false,
  //       },
  //     });
  //
  //     const allOrgs = rawOrgs as unknown as OrganizationWithMembers[];
  //     const orgMap = new Map<number, OrgChartDto>();
  //
  //     for (const org of allOrgs) {
  //       const node: OrgChartDto = {
  //         id: org.id,
  //         name: org.name,
  //         level: 0,
  //         description: org.desc || '',
  //         regDate: formatDate(org.regTime) || '',
  //         children: [],
  //         members:
  //           includeMembers && org.employee
  //             ? org.employee.map((emp) => ({
  //                 id: emp.id,
  //                 nameKr: emp.nameKr,
  //                 jobRole: emp.jobRole ?? '',
  //               }))
  //             : undefined,
  //       };
  //       orgMap.set(org.id, node);
  //     }
  //
  //     const rootNodes: OrgChartDto[] = [];
  //     allOrgs.forEach((org) => {
  //       const currentNode = orgMap.get(org.id)!;
  //
  //       if (org.parentId === null) {
  //         // 최상위 노드인 경우 루트 배열에 추가
  //         rootNodes.push(currentNode);
  //       } else {
  //         // 부모가 있는 경우, Map에서 부모를 찾아 그 자식 배열에 현재 노드를 push
  //         const parentNode = orgMap.get(org.parentId);
  //         if (parentNode) {
  //           parentNode.children!.push(currentNode);
  //         }
  //       }
  //     });
  //
  //     // 5. 재귀 함수를 이용해 레벨(level)을 정확히 계산
  //     const setLevel = (nodes: OrgChartDto[], level: number) => {
  //       nodes.forEach((node) => {
  //         node.level = level;
  //         if (node.children && node.children.length > 0) {
  //           setLevel(node.children, level + 1);
  //         }
  //       });
  //     };
  //
  //     setLevel(rootNodes, 1);
  //
  //     return rootNodes;
  //   } catch (error: unknown) {
  //     throw new InternalServerErrorException(error instanceof Error ? error.message : '조직도 조회 중 오류');
  //   }
  // }

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

  /**
   * 특정 카테고리(type)의 코드 목록 조회
   * 예: getCodesByType('RANK') -> 대리, 과장, 차장...
   */
  async getCodesByType(type: string) {
    return this.prisma.commonCode.findMany({
      where: {
        type,
        isUsed: true, // 사용 중인 코드만 필터링
      },
      select: {
        type: true,
        code: true,
        name: true,
        attr1: true,
      },
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
}
