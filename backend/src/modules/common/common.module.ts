import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CommonController],
  providers: [CommonService, PrismaService],
  exports: [CommonService],
})
export class CommonModule {}
