import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum CareerRange {
  BEGINNER = '0-3',
  JUNIOR = '4-7',
  SENIOR = '8-12',
  EXPERT = '13-',
}

export class QueryEmployeeDto {
  @ApiPropertyOptional({ description: '실(department) ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ description: '팀(Team) ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({ description: '이름 또는 사번 검색' })
  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @ApiPropertyOptional({ description: '직급' })
  @IsOptional()
  @IsString()
  jobLevel?: string;

  @ApiPropertyOptional({ description: '기술 레벨 (초급, 중급, 고급, 특급)' })
  @IsOptional()
  @IsString()
  skillLevel?: string;

  @ApiPropertyOptional({ description: '투입 상태 (투입_정산, 대기 등)' })
  @IsOptional()
  @IsString()
  assignStatus?: string;

  @ApiPropertyOptional({ description: '경력 범위', enum: CareerRange })
  @IsOptional()
  @IsEnum(CareerRange)
  careerRange?: CareerRange;
}
