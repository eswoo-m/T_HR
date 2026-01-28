import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TeamStructureDto } from './dto/team-structure.dto';
import { OrgChartDto } from './dto/org-chart.dto';
import { Department } from '@prisma/client';

interface DepartmentWithChildren extends Department {
  level: number;
  children?: DepartmentWithChildren[];
  employee?: any[];
}

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamStructure(teamId: number): Promise<TeamStructureDto> {
    const team = await this.prisma.department.findUnique({
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
                hrStatus: 'ACTIVE',
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

  // 조직도
  async getOrganizationChart(includeMembers: boolean): Promise<OrgChartDto[]> {
    try {
      const departments = (await this.prisma.department.findMany({
        where: { parentId: null },
        include: {
          children: {
            include: {
              employee: includeMembers
                ? {
                    where: { employeeDetail: { is: { hrStatus: 'ACTIVE' } } },
                    select: { id: true, nameKr: true, jobRole: true },
                  }
                : false,
              children: true, // 필요 깊이만큼 추가
            },
          },

          // 최상위 조직의 멤버 포함 여부
          employee: includeMembers
            ? {
                where: { employeeDetail: { is: { hrStatus: 'ACTIVE' } } },
                select: { id: true, nameKr: true, jobRole: true },
              }
            : false,
        },
      })) as DepartmentWithChildren[];

      const formatOrg = (dept: DepartmentWithChildren, currentLevel: number): OrgChartDto => {
        const node: OrgChartDto = {
          id: dept.id,
          name: dept.name,
          level: currentLevel,
          children:
            dept.children && dept.children.length > 0
              ? dept.children.map((child) => formatOrg(child, currentLevel + 1)) // ✅ 자식은 현재 레벨 + 1
              : [],
        };

        if (includeMembers && Array.isArray(dept.employee)) {
          node.members = dept.employee.map((emp: { id: number; nameKr: string; jobRole: string }) => ({
            id: emp.id,
            nameKr: emp.nameKr,
            jobRole: emp.jobRole,
          }));
        }

        return node;
      };

      // 최초 호출 시 level 1 부여
      return departments.map((dept) => formatOrg(dept, 1));
    } catch (error: unknown) {
      throw new InternalServerErrorException(error instanceof Error ? error.message : '조직도 조회 중 오류');
    }
  }

  // 팀 목록: 선택된 부서 ID로 필터링
  async getDepartments() {
    return this.prisma.department.findMany({
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

  async getTeamsByDept(deptId: number) {
    const department = await this.prisma.department.findUnique({
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
    return await this.prisma.commonCode.findMany({
      where: {
        type,
        isUsed: true // 사용 중인 코드만 필터링
      },
      select: {
        code: true,
        name: true
      },
      orderBy: { id: 'asc' }, // 혹은 정렬용 별도 컬럼이 있다면 그것을 사용
    });
  }

  /**
   * 여러 타입의 코드를 한 번에 조회 (화면 초기 로딩 최적화용)
   */
  async getCodesByTypes(types: string[]) {
    return await this.prisma.commonCode.findMany({
      where: {
        type: { in: types },
        isUsed: true,
      },
      select: { type: true, code: true, name: true },
      orderBy: { id: 'asc' },
    });
  }
}
