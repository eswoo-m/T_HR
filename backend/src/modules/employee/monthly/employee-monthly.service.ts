import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryMonthlyListDto } from './dto/query-monthly-list.dto';

@Injectable()
export class EmployeeMonthlyService {
  constructor(private readonly prisma: PrismaService) {}

  async query(query: QueryMonthlyListDto) {
    // 1. 쿼리 파라미터 처리 (DTO에 jobLevel이 있더라도 실제 DB 필드인 jobPosition으로 매핑)
    const { yearMonth, searchKeyword, departmentId, teamId, assignStatus } = query;
    const jobPositionValue = (query as any).jobLevel || (query as any).jobPosition;

    // 2. 프로젝트 카테고리(투입_정산, 지원 등) 조회
    const categories = await this.prisma.commonCode.findMany({
      where: {
        type: 'PROJECT_CATEGORY',
        isUsed: true,
      },
      select: { name: true },
      orderBy: { id: 'asc' },
    });

    // 3. 월간 투입 레코드 조회
    const records = await this.prisma.employeeMonthlyMm.findMany({
      where: {
        yearMonth: yearMonth,
        employee: {
          assignStatus: assignStatus || undefined,
          // ✅ 수정: 스키마에 실존하는 jobPosition 필드 사용
          jobPosition: jobPositionValue || undefined, 
          OR: searchKeyword 
            ? [{ nameKr: { contains: searchKeyword } }, { no: { contains: searchKeyword } }] 
            : undefined,
          departmentId: departmentId ? Number(departmentId) : undefined,
          teamId: teamId ? Number(teamId) : undefined,
        },
      },
      include: {
        employee: {
          include: {
            department: true,
            team: true,
            projectAssignments: {
              include: {
                project: true,
                projectAssignmentPeriod: {
                  where: {
                    AND: [
                      { startDate: { lte: new Date(`${yearMonth}-31`) } }, 
                      { OR: [{ endDate: null }, { endDate: { gte: new Date(`${yearMonth}-01`) } }] }
                    ],
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        employee: { nameKr: 'asc' },
      },
    });

    // 4. 데이터 가공 (Frontend 전달용)
    const list = records
      .map((record) => {
        const emp = record.employee;

        // 카테고리별 컬럼 초기화
        const projectColumns = categories.reduce((acc, cat) => {
          acc[cat.name] = 0;
          return acc;
        }, {});

        // 해당 레코드의 MM 값을 카테고리에 할당
        if (record.assignStatus && Object.prototype.hasOwnProperty.call(projectColumns, record.assignStatus)) {
          projectColumns[record.assignStatus] = Number(record.value);
        }

        const totalMm = Number(record.value);
        const calculatedStatus = totalMm === 0 ? 'IDLE' : totalMm > 1.0 ? 'OVER' : 'ACTIVE';

        // 상태 필터링 (ALL이 아닌 경우)
        if (assignStatus && assignStatus !== 'ALL' && calculatedStatus !== assignStatus) {
          return null;
        }

        return {
          name: emp.nameKr,
          code: emp.id,
          department: emp.department?.name ?? '-',
          team: emp.team?.name ?? '-',
          // ✅ 수정: 존재하지 않는 jobLevel 대신 jobPosition 사용
          position: emp.jobPosition ?? '-', 
          // ✅ 수정: jobRole은 스키마에 존재하므로 유지
          title: emp.jobRole ?? '-',     
          ...projectColumns,
          totalMm: parseFloat(totalMm.toFixed(2)),
          effortRate: `${Math.round(totalMm * 100)}%`,
          assignStatus: calculatedStatus,
        };
      })
      .filter((item) => item !== null);

    return {
      summary: {
        totalCount: list.length,
        activeCount: list.filter((i) => i.assignStatus === 'ACTIVE').length,
        idleCount: list.filter((i) => i.assignStatus === 'IDLE').length,
        overCount: list.filter((i) => i.assignStatus === 'OVER').length,
      },
      list,
    };
  }
}