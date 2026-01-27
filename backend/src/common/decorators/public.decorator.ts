import { SetMetadata } from '@nestjs/common';

// JwtAuthGuard에서 이 키를 사용해 인증 제외 여부를 판단합니다.
export const IS_PUBLIC_KEY = 'isPublic';

// @Public() 데코레이터를 정의합니다.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
