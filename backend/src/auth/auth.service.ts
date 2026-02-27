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
    // 1. 사번(id)으로 사용자 조회
    const user = await this.prisma.employee.findUnique({
      where: { id: loginId },
    });

    // 2. 사번이 존재하지 않는 경우 차단
    if (!user) {
      throw new UnauthorizedException('사번 또는 비밀번호가 일치하지 않습니다.');
    }

    // 3. 비밀번호 검증 (bcrypt 암호화 비교)
    const isMatch = await bcrypt.compare(pass, user.password);
    
    // 비밀번호가 틀린 경우 차단 (보안상 사번이 틀린지, 비번이 틀린지 모르게 동일한 메시지 출력)
    if (!isMatch) {
      throw new UnauthorizedException('사번 또는 비밀번호가 일치하지 않습니다.');
    }

    // 4. 퇴사 여부 체크 (퇴사자는 로그인 불가)
    if (user.exitDate !== null) {
      throw new UnauthorizedException('퇴사한 사원은 로그인할 수 없습니다.');
    }

    // 5. JWT 토큰 페이로드 구성
    const payload = {
      id: user.id,
      no: user.no,
      role: user.authLevel,
    };

    // 6. 1시간짜리 토큰 및 유저 정보 반환
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.nameKr,
        role: user.jobLevel,
        authLevel: user.authLevel,
      },
    };
  }
}