import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class AssetTypeDto {
  @IsString()
  @IsNotEmpty({ message: '유형명은 필수입니다.' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssetDto {
  @IsString()
  @IsNotEmpty({ message: '자산명은 필수입니다.' })
  name: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsNumber()
  @IsNotEmpty({ message: '자산 유형 ID는 필수입니다.' })
  typeId: number;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  serialNo?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsDateString({}, { message: '올바른 날짜 형식이 아닙니다.' })
  @IsNotEmpty()
  purchaseDate: string;

  @IsNumber()
  @IsNotEmpty()
  purchaseAmount: number;

  @IsString()
  @IsOptional()
  team?: string;

  @IsNumber()
  @IsOptional()
  teamId?: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsDateString()
  @IsOptional()
  assignDate?: string;

  @IsDateString()
  @IsOptional()
  warrantyDate?: string;
}
