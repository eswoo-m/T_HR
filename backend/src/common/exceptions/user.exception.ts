import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UserNotFoundException extends BaseException {
  constructor(userId?: number) {
    super(
      userId
        ? `${userId}번 사용자를 찾을 수 없습니다.`
        : '사용자를 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
    );
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `'${email}'은 이미 등록된 이메일입니다.`,
      HttpStatus.CONFLICT,
      'USER_ALREADY_EXISTS',
    );
  }
}
