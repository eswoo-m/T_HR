import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 다른 모듈에서 매번 import 하지 않아도 되게 전역으로 설정합니다.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 다른 곳에서 PrismaService를 쓸 수 있게 내보냅니다.
})
export class PrismaModule {} // 이 이름이 중요합니다!
