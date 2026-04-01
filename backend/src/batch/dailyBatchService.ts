import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyBatchService {
  private readonly logger = new Logger(DailyBatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  //@Cron(CronExpression.EVERY_MINUTE)
  async handleDailyTask() {
    this.logger.log('Daily Batch START... ');

    await this.processEmployeeOrganizationUpdates(); //조직도 변경 (job_role, job_position, job_role2, team_id, department_id)
    await this.processEmployeeAssignStatusUpdate(); // 구성원 상태변경(투입_정산, 투입_지원, 대기, 관리, 지원)
    await this.porcessProjectStatus(); // 프로젝트 상태변경(PLANNED, IN_PROGRESS, COMPLETED)
  }

  // 조직 변경 내역 업데이트
  private async processEmployeeOrganizationUpdates() {
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
              jobRole2: h.jobRole2,
            },
          });
        }),
      );

      this.logger.log(`오늘자 조직 개편 ${targetHistories.length}건 반영 완료!`);
    } catch (error) {
      this.logger.error('배치 로직 수행 중 에러 발생!', error);
    }
  }

  // 투입 상태 자동 업데이트
  private async processEmployeeAssignStatusUpdate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      this.logger.log(`사원 투입 상태 업데이트 시작 (hrStatus 체크 포함)`);
      this.logger.log(`TODAY:: ${today.toLocaleDateString()}`);

      const activeAssignments = await this.prisma.projectAssignment.findMany({
        where: {
          startDate: { lte: today },
          endDate: { gte: today },
        },
        select: { employeeId: true },
      });
      const activeIds = Array.from(new Set(activeAssignments.map((a) => a.employeeId)));
      console.log('Active Employee IDs:', activeIds);

      const employedMembers = await this.prisma.employee.findMany({
        where: {
          employeeDetail: {
            hrStatus: 'EMPLOYED',
          },
        },
        select: { id: true },
      });
      const employedIds = employedMembers.map((m) => m.id);

      await this.prisma.$transaction(async (tx) => {
        await tx.employee.updateMany({
          where: {
            id: { in: employedIds, notIn: activeIds },
            assignStatus: { notIn: ['MANAGEMENT', 'GEN_SUPPORT'] },
          },
          data: { assignStatus: 'WAITING' },
        });

        const targetActiveIds = activeIds.filter((id) => employedIds.includes(id));

        if (targetActiveIds.length > 0) {
          this.logger.log(`업데이트 대상 ID: ${targetActiveIds.join(', ')}`);

          const result = await tx.employee.updateMany({
            where: {
              id: { in: targetActiveIds },
            },
            data: { assignStatus: 'ASSIGNED_SETTLEMENT' },
          });
          this.logger.log(`재직자 ${result.count}명 상태 업데이트 완료.`);
        }
      });
    } catch (error) {
      this.logger.error('배치 실행 중 에러 발생!', error);
    }
  }

  private async porcessProjectStatus() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    try {
      this.logger.log('프로젝트 상태 자동 업데이트 시작...');

      await this.prisma.$transaction(async (tx) => {
        // ✅ 1단계: PLANNED -> IN_PROGRESS
        // 시작일(reg_date 또는 start_date)이 오늘이거나 지났는데 아직 PLANNED인 경우
        const startResult = await tx.project.updateMany({
          where: {
            status: 'PLANNED',
            startDate: { lte: now },
          },
          data: {
            status: 'IN_PROGRESS',
          },
        });

        // ✅ 2단계: IN_PROGRESS -> COMPLETED
        const endResult = await tx.project.updateMany({
          where: {
            status: 'IN_PROGRESS',
            endDate: { lt: now },
          },
          data: {
            status: 'COMPLETED',
          },
        });

        this.logger.log(`프로젝트 상태 변경 완료: 진행중 전환(${startResult.count}건), 완료 전환(${endResult.count}건)`);
      });
    } catch (error) {
      this.logger.error('프로젝트 상태 업데이트 중 에러 발생!', error);
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
