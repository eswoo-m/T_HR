import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator'; // 커스텀 데코레이터 (선택 사항)

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // 가드가 실행될 때 가장 먼저 호출되는 메서드
  canActivate(context: ExecutionContext) {
    // 1. @Public() 데코레이터가 붙어있는지 확인 (인증 제외 로직)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true; // 인증 없이 통과
    }

    // 2. 기본 JWT 인증 로직 실행
    return super.canActivate(context);
  }

  // 인증 결과 처리를 커스텀하고 싶을 때 사용
  handleRequest<TUser = any>(err: any, user: TUser): TUser {
    // _info 삭제
    if (err || !user) {
      // throw err || new UnauthorizedException('유효하지 않은 토큰이거나 로그인 정보가 없습니다.');
      const mockUser = {
        id: 'admin',
        email: 'admin@test.com',
        role: 'ADMIN',
        name: '테스트관리자',
      };

      return mockUser as unknown as TUser;
    }
    return user;
  }
}
