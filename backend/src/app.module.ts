import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/env.config';
import databaseConfig from './config/database.config';
import { CommonModule } from './modules/common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 핵심: NODE_ENV가 local이면 .env.local 파일을 읽어옵니다.
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: [configuration, databaseConfig],
      isGlobal: true, // 서비스 어디서든 process.env를 쓸 수 있게 함
    }),
    CommonModule,
    PrismaModule,
    EmployeeModule,
    ProjectModule,
  ],
})
export class AppModule {}
