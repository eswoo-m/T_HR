import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEmployeeAuthDto {
  @IsString()
  @IsNotEmpty()
  authLevel: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}