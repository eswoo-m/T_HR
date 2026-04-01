import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginId: string, pass: string) {
    // ... 기존 login 로직 (생략하지 않고 그대로 두시면 됩니다)
    const user = await this.prisma.employee.findUnique({
      where: { id: loginId },
    });

    if (!user) {
      throw new UnauthorizedException('사번 또는 비밀번호가 일치하지 않습니다.');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('사번 또는 비밀번호가 일치하지 않습니다.');
    }

    if (user.exitDate !== null) {
      throw new UnauthorizedException('퇴사한 사원은 로그인할 수 없습니다.');
    }

    const payload = { id: user.id, no: user.no, role: user.authLevel };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.nameKr,
        role: user.jobPosition,
        authLevel: user.authLevel,
      },
    };
  }

  // ✨ [여기에 추가하세요] 테스트용 어드민 생성 로직
  // auth.service.ts

  async seedAdmin() {
    const adminId = 'admin';

    // 1. 이미 존재하는지 확인
    const existing = await this.prisma.employee.findUnique({
      where: { id: adminId },
    });

    // 🌟 기존에 평문으로 잘못 저장된 데이터가 있다면 삭제 후 재생성하기 위해 처리
    if (existing) {
      if (!existing.password.startsWith('$')) {
        await this.prisma.employee.delete({ where: { id: adminId } });
      } else {
        return { message: '이미 암호화된 관리자 계정이 존재합니다.', status: 'existing' };
      }
    }

    // 2. '1234qwer!@#$' 비밀번호를 암호화
    const hashedPassword = await bcrypt.hash('1234qwer!@#$', 10);

    // 3. 암호화된 비번으로 관리자 생성
    await this.prisma.employee.create({
      data: {
        id: adminId,
        no: '10001',
        password: hashedPassword, // ✅ 이제 DB에는 암호화된 값이 들어갑니다.
        nameKr: '테스트관리자',
        residentNo: '000000-0000000',
        birthDate: new Date('1990-01-01'),
        gender: 'MALE',
        authLevel: 'ADMIN',
        joinDate: new Date(),
        jobPosition: '관리자',
      },
    });

    return { message: '관리자 계정이 암호화되어 생성되었습니다.', status: 'created' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.employee.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.employee.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  async initializePassword(targetId: string) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id: targetId },
      });

      if (!employee) {
        throw new NotFoundException('해당 사원을 찾을 수 없습니다.');
      }

      const hashedPassword = await bcrypt.hash('qwer!@#$', 10);

      return await this.prisma.employee.update({
        where: { id: targetId },
        data: { password: hashedPassword },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message || '서버 에러가 발생했습니다.');
    }
  }
}
