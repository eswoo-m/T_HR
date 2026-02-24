import { IsArray, IsNumber, IsString } from 'class-validator';

export class MoveMembersDto {
  @IsArray()
  @IsString({ each: true })
  memberIds: string[];

  @IsNumber()
  targetDeptId: number;
}
