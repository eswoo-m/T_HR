import { UseGuards, Controller, Post, Body, HttpCode, HttpStatus, Param, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmployeeDTO } from '@modules/dto/employee.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인', description: '사번과 비밀번호로 JWT 토큰을 발급받습니다.' })
  async login(@Body() loginDto: { id: string; pass: string }) {
    return this.authService.login(loginDto.id, loginDto.pass);
  }

  @Public()
  @Post('seed-admin')
  async seedAdmin() {
    return this.authService.seedAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@GetUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password/:id')
  async resetPassword(@Param('id') targetId: string, @GetUser() admin: EmployeeDTO) {
    if (admin.authLevel !== 'SUPER_ADMIN') {
      throw new ForbiddenException('비밀번호 초기화 권한이 없습니다.');
    }

    return await this.authService.initializePassword(targetId);
  }
}
