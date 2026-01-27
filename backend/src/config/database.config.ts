import { registerAs } from '@nestjs/config';

// 'database'라는 네임스페이스로 설정을 등록합니다.
export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  // 나중에 확장 가능한 설정들 (Prisma 설정 등)
  logging: process.env.NODE_ENV === 'local', // 로컬에서만 쿼리 로그 출력
  maxConnections: 10,
}));
