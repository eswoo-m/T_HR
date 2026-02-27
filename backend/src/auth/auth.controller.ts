import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인', description: '사번과 비밀번호로 JWT 토큰을 발급받습니다.' })
  async login(@Body() loginDto: { id: string; pass: string }) {
    return this.authService.login(loginDto.id, loginDto.pass);
  }
}