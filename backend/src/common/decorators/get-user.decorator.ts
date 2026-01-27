import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  // 1. 역참조 시 타입을 명시적으로 지정
  const request = ctx.switchToHttp().getRequest<Request>();

  // 2. request.user가 any로 잡히지 않도록 타입을 단언하거나 unknown 처리
  const user = request.user as Record<string, any> | undefined;

  if (!user) {
    return null;
  }

  // 3. 데이터를 안전하게 반환
  return data ? (user[data] as unknown) : (user as unknown);
});
