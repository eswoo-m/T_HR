import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // 🌟 환경변수 사용 권장, 기본값은 팀 내에서 정한 secret-key 유지
      secret: process.env.JWT_SECRET || 'your-secret-key',
      // 🌟 요청하신 대로 로그인 유지 시간을 1시간으로 변경
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy],
  // 🌟 컨트롤러를 등록해야 /auth/login 엔드포인트가 활성화됩니다.
  controllers: [AuthController], 
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}