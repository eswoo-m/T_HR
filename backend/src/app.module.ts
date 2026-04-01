import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/env.config';
import databaseConfig from './config/database.config';
import { CommonModule } from '@modules/common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from '@modules/employee/employee.module';
import { ProjectModule } from '@modules/project/project.module';
import { OrganizationModule } from '@modules/organization/organization.module';

import { ScheduleModule } from '@nestjs/schedule';
import { DailyBatchService } from './batch/dailyBatchService';
import { AssetModule } from '@modules/asset/asset.module';
import { MonthlyBatchService } from './batch/MonthlyBatchService';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 핵심: NODE_ENV가 local이면 .env.local 파일을 읽어옵니다.
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: [configuration, databaseConfig],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AssetModule,
    CommonModule,
    PrismaModule,
    EmployeeModule,
    ProjectModule,
    OrganizationModule,
  ],
  providers: [DailyBatchService, MonthlyBatchService],
})
export class AppModule {}
