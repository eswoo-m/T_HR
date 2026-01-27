import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProjectsDto {
  @IsOptional()
  @IsString()
  keyword?: string; // 프로젝트명 또는 고객사명 검색용

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number; // 부서(실) 선택

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number; // 팀 선택

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 1000;
}
