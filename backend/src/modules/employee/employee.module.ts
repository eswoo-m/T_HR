import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeMonthlyService } from './monthly/employee-monthly.service';
import { EmployeeMonthlyController } from './monthly/employee-monthly.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule], // 필요한 경우 공통 모듈(예: PrismaModule) 임포트
  controllers: [EmployeeController, EmployeeMonthlyController],
  providers: [EmployeeService, EmployeeMonthlyService],
  exports: [EmployeeService, EmployeeMonthlyService],
})
export class EmployeeModule {}
