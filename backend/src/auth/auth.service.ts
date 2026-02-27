import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginId: string, pass: string) {
    // 1. 사번으로 사용자 조회
    const user = await this.prisma.employee.findUnique({
      where: { id: loginId },
    });

    if (!user) {
      throw new UnauthorizedException('사번 또는 비밀번호가 일치하지 않습니다.');
    }

    // 2. 비밀번호 검증 (암호화된 비번 비교)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('사번 또는 비밀번호가 일치하지 않습니다.');
    }

    // 3. 퇴사 여부 체크 (DBA 조언: 퇴사자는 로그인 불가)
    if (user.exitDate !== null) {
      throw new UnauthorizedException('퇴사한 사원은 로그인할 수 없습니다.');
    }

    // 4. JWT 토큰 페이로드 생성
    const payload = {
      id: user.id,
      no: user.no,
      role: user.authLevel,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.nameKr,
        role: user.authLevel,
      },
    };
  }
}
