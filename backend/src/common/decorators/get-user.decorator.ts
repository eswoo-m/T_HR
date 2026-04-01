// src/auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Employee } from '@prisma/client';

export const GetUser = createParamDecorator((data: keyof Employee | undefined, ctx: ExecutionContext) => {
  // 요청 객체에서 user가 Employee 타입임을 명시
  const request = ctx.switchToHttp().getRequest<{ user: Employee }>();
  const user = request.user;

  return data ? user?.[data] : user;
});
