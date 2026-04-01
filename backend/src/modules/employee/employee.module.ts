import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { EmployeeBatchService } from '../../batch/employeeBatchService';

@Module({
  imports: [PrismaModule, AuthModule], // 필요한 경우 공통 모듈(예: PrismaModule) 임포트
  controllers: [EmployeeController],
  providers: [EmployeeService /*, EmployeeBatchService*/],
  exports: [EmployeeService],
})
export class EmployeeModule {}
