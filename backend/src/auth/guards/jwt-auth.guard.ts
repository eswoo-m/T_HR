import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), 
      context.getClass()
    ]);

    if (isPublic) {
      return true; // 인증 없이 통과
    }

    // 2. 기본 JWT 인증 로직 실행
    return super.canActivate(context);
  }

  // 인증 결과 처리를 커스텀하고 싶을 때 사용
  handleRequest<TUser = any>(err: any, user: TUser): TUser {
    // 🌟 [수정됨] 에러가 있거나 토큰으로 해석된 유저 정보가 없다면 무조건 차단!
    if (err || !user) {
      // 가짜 데이터(mockUser) 대신, 실제 401 에러를 던져 프론트엔드로 내쫓습니다.
      throw err || new UnauthorizedException('유효하지 않은 토큰이거나 로그인 정보가 없습니다.');
    }
    
    // 정상적인 토큰 인증을 통과했다면 유저 데이터를 반환합니다 (@GetUser 데코레이터로 전달됨)
    return user;
  }
}