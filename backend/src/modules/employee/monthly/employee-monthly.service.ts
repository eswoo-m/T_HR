import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryMonthlyListDto } from './dto/query-monthly-list.dto';

@Injectable()
export class EmployeeMonthlyService {
  constructor(private readonly prisma: PrismaService) {}

  async query(query: QueryMonthlyListDto) {
    const { yearMonth, searchKeyword, departmentId, teamId, assignStatus, jobLevel } = query;

    // 투입_정산, 투입_지원, 대기, 관리 카테고리 조회
    const categories = await this.prisma.commonCode.findMany({
      where: {
        type: 'PROJECT_CATEGORY',
        isUsed: true,
      },
      select: { name: true },
      orderBy: { id: 'asc' },
    });

    const records = await this.prisma.employeeMonthlyMm.findMany({
      where: {
        yearMonth: yearMonth,
        employee: {
          assignStatus: assignStatus || undefined,
          jobLevel: jobLevel || undefined,
          OR: searchKeyword ? [{ nameKr: { contains: searchKeyword } }, { no: { contains: searchKeyword } }] : undefined,
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
                    AND: [{ startDate: { lte: new Date(`${yearMonth}-31`) } }, { OR: [{ endDate: null }, { endDate: { gte: new Date(`${yearMonth}-01`) } }] }],
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

    const list = records
      .map((record) => {
        const emp = record.employee;

        const projectColumns = categories.reduce((acc, cat) => {
          acc[cat.name] = 0;
          return acc;
        }, {});

        if (record.assignStatus && Object.prototype.hasOwnProperty.call(projectColumns, record.assignStatus)) {
          projectColumns[record.assignStatus] = Number(record.value);
        }

        const totalMm = Number(record.value);
        const calculatedStatus = totalMm === 0 ? 'IDLE' : totalMm > 1.0 ? 'OVER' : 'ACTIVE';

        if (assignStatus && assignStatus !== 'ALL' && calculatedStatus !== assignStatus) {
          return null;
        }
        return {
          name: emp.nameKr,
          code: emp.id,
          department: emp.department?.name ?? '-',
          team: emp.team?.name ?? '-',
          rank: emp.jobLevel ?? '-',
          role: emp.jobRole ?? '-',
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
