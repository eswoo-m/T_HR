import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyBatchService {
  private readonly logger = new Logger(DailyBatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleDailyTask() {
    this.logger.log('Daily Batch START... ');

    await this.processOrganizationUpdates();
  }

  private async processOrganizationUpdates() {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;

    const kstNow = new Date(now.getTime() + kstOffset);
    kstNow.setHours(0, 0, 0, 0);

    const today = new Date(kstNow.getTime() - kstOffset);
    try {
      const targetHistories = await this.prisma.employeeOrganizationHistory.findMany({
        where: {
          applyDate: today,
        },
        orderBy: {
          id: 'asc',
        },
        include: {
          department: {
            include: { _count: { select: { children: true } } },
          },
        },
      });

      if (targetHistories.length === 0) {
        this.logger.log('오늘 반영할 조직 변경 내역이 없습니다.');
        return;
      }

      this.logger.log(`총 ${targetHistories.length}건의 조직 변경을 처리합니다.`);

      await Promise.all(
        targetHistories.map(async (history) => {
          const h = history as HistoryWithRelations;

          return this.prisma.employee.update({
            where: { id: h.employeeId },
            data: {
              departmentId: h.departmentId,
              teamId: h.teamId,
              deptId: h.teamId,
              jobPosition: h.jobPosition,
              jobTitle: h.jobTitle,
              jobRole: h.jobRole,
            },
          });
        }),
      );

      this.logger.log(`오늘자 조직 개편 ${targetHistories.length}건 반영 완료!`);
    } catch (error) {
      this.logger.error('배치 로직 수행 중 에러 발생!', error);
    }
  }
}

type HistoryWithRelations = Prisma.EmployeeOrganizationHistoryGetPayload<{
  include: {
    department: {
      include: { _count: { select: { children: true } } };
    };
  };
}>;
