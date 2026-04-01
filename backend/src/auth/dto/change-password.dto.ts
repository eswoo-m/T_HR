import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  readonly currentPassword!: string;

  @IsString()
  @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
  readonly newPassword!: string;
}
