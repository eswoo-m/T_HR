import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      // 1. Authorization 헤더에서 Bearer 토큰을 추출합니다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // .env 설정 권장
    });
  }

  // 토큰 검증이 성공하면 호출됩니다.
  async validate(payload: { id: string; no: number }) {
    // 사용자가 입력한 계정 ID(id)로 사원 조회
    const user = await this.prisma.employee.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.exitDate !== null) {
      throw new UnauthorizedException('접근 권한이 없거나 퇴사한 사원입니다.');
    }

    return user;
  }
}
