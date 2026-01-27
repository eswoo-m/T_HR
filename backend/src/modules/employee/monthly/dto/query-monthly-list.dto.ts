import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryMonthlyListDto {
  @ApiProperty({ type: String, format: 'string', required: true, description: 'YYYY-MM', example: '2026-01' })
  @IsString()
  @ApiProperty({ example: '2024-01', pattern: '^\\d{4}-\\d{2}$' })
  yearMonth: string;

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

  @ApiPropertyOptional({ description: '직급 ID' })
  @IsOptional()
  @IsString()
  jobLevel?: string;

  @ApiPropertyOptional({ description: '투입 상태 (투입_정산, 대기 등)' })
  @IsOptional()
  @IsString()
  assignStatus?: string;
}
