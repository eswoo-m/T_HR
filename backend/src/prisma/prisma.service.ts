import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // ConfigService를 주입받습니다.
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          // database.config.ts에서 등록한 url을 가져옵니다.
          url: configService.get<string>('database.url'),
        },
      },
      // 설정에 따라 로그 출력 여부 결정
      log: configService.get<boolean>('database.logging') ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
