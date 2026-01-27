import { Module } from '@nestjs/common';
import { CustomerController } from './customer-management/customer.controller';
import { CustomerService } from './customer-management/customer.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController, CustomerController],
  providers: [ProjectService, CustomerService],
})
export class ProjectModule {}
