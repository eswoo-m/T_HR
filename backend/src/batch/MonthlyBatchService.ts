import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class MonthlyBatchService {
  private readonly logger = new Logger(MonthlyBatchService.name);

  constructor(private prisma: PrismaService) {}

  // 매월 1일 새벽 1시에 실행
  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async handleMonthlyTask() {
    this.logger.log('Monthly Batch START... ');

    await this.processMonthlyMmBatch();
    await this.processEmployeeSwExperienceBatch();
  }

  // 매월 M/M 업데이트
  private async processMonthlyMmBatch() {
    this.logger.log('M/M Calculation Batch Started (Ghost Data Fixed)...');

    // 1. 전월 날짜 설정 (예: 3월 실행 시 2월 데이터 계산)
    const lastMonth = dayjs().subtract(1, 'month');
    const yearMonth = lastMonth.format('YYYY-MM');
    const monthStart = lastMonth.startOf('month'); // 2026-02-01 00:00:00
    const monthEnd = lastMonth.endOf('month'); // 2026-02-28 23:59:59
    const daysInMonth = monthEnd.date();

    // DB 저장용 날짜 문자열 (Timezone 왜곡 방지)
    const startDateStr = monthStart.format('YYYY-MM-DD');
    const endDateStr = monthEnd.format('YYYY-MM-DD');

    try {
      // 2. 대상 사원 및 투입 이력 조회
      const [allEmployees, periods] = await Promise.all([
        this.prisma.employee.findMany({
          where: {
            employeeDetail: {
              hrStatus: 'EMPLOYED',
            },
            joinDate: { lte: monthEnd.toDate() },
            OR: [{ exitDate: null }, { exitDate: { gte: monthStart.toDate() } }],
          },
          select: {
            id: true,
            assignStatus: true,
            exitDate: true,
          },
        }),

        // 프로젝트 투입 기간 조회 (기존과 동일)
        this.prisma.projectAssignmentPeriod.findMany({
          where: {
            startDate: { lte: monthEnd.toDate() },
            OR: [{ endDate: null }, { endDate: { gte: monthStart.toDate() } }],
          },
          include: { assignment: { select: { employeeId: true } } },
        }),
      ]);

      const mmRecords: Prisma.EmployeeMonthlyMmCreateManyInput[] = [];

      // 3. 사원별 루프 (233명 내외 대상)
      for (const emp of allEmployees) {
        // [핵심 해결책 1] 1월 31일 퇴사자 등 전월 시작 전 퇴사자 확실히 스킵
        if (emp.exitDate && dayjs(emp.exitDate).isBefore(monthStart)) {
          continue;
        }

        const empPeriods = periods.filter((p) => p.assignment.employeeId === emp.id);

        // [핵심 해결책 2] undefined 방지 (기본값 설정 및 문자열 보장)
        const defaultStatus = emp.assignStatus ? String(emp.assignStatus) : 'WAITING';
        const dailyStatus = Array.from({ length: daysInMonth }, () => defaultStatus);

        // 실제 투입 기록 매핑 (하루 1.0 유지)
        for (const period of empPeriods) {
          const startIdx = dayjs(period.startDate).isBefore(monthStart) ? 0 : dayjs(period.startDate).date() - 1;
          const endIdx = !period.endDate || dayjs(period.endDate).isAfter(monthEnd) ? daysInMonth - 1 : dayjs(period.endDate).date() - 1;

          for (let i = startIdx; i <= endIdx; i++) {
            if (i >= 0 && i < daysInMonth) {
              // 투입 기록의 상태가 있으면 적용, 없으면 기본값 유지
              dailyStatus[i] = period.status || defaultStatus;
            }
          }
        }

        // 퇴사자 처리 (2월 중 퇴사한 경우 그날까지만 계산)
        let effectiveDays = daysInMonth;
        if (emp.exitDate && dayjs(emp.exitDate).isBefore(monthEnd)) {
          effectiveDays = dayjs(emp.exitDate).date();
        }

        // 4. 상태별 일수 집계
        const statusCounts: Record<string, number> = {};
        for (let i = 0; i < effectiveDays; i++) {
          const s = dailyStatus[i];
          statusCounts[s] = (statusCounts[s] || 0) + 1;
        }

        // 5. M/M 레코드 생성
        Object.entries(statusCounts).forEach(([status, count]) => {
          // 비중 계산 (0.001 단위까지)
          const mmValue = Number((count / daysInMonth).toFixed(3));

          if (mmValue > 0) {
            mmRecords.push({
              employeeId: emp.id,
              yearMonth: yearMonth,
              startDate: new Date(startDateStr),
              endDate: new Date(endDateStr),
              assignStatus: status,
              value: new Prisma.Decimal(mmValue),
            });
          }
        });
      }

      // 6. 트랜잭션 처리 (삭제 후 삽입)
      await this.prisma.$transaction([this.prisma.employeeMonthlyMm.deleteMany({ where: { yearMonth: yearMonth } }), this.prisma.employeeMonthlyMm.createMany({ data: mmRecords })]);

      this.logger.log(`[Success] ${yearMonth} Batch Completed.`);
      this.logger.log(`Total Target Employees: ${allEmployees.length}, Final Records: ${mmRecords.length}`);
    } catch (error) {
      this.logger.error('[Error] Batch Failed:', error);
    }
  }

  private async processEmployeeSwExperienceBatch() {
    const today = new Date();

    try {
      console.log(`[${today.toISOString()}] 월간 총 경력 갱신 배치 시작`);

      const result = await this.prisma.employeeDetail.updateMany({
        where: {
          hrStatus: 'EMPLOYED',
          employee: {
            OR: [
              { exitDate: null }, // 퇴사일 없음
              { exitDate: { gt: today } }, // 퇴사 예정 (오늘 이후)
            ],
          },
        },
        data: {
          totalSwExperience: {
            increment: 1,
          },
        },
      });

      console.log(`총 ${result.count}명의 경력이 1개월 추가되었습니다.`);
    } catch (error) {
      console.error('경력 갱신 배치 처리 중 오류 발생:', error);
      throw error;
    }
  }
}
