import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetOrganizationHistoryDto {
  @ApiPropertyOptional({ description: '시작 날짜 (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '종료 날짜 (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: '조직명 또는 부서명 검색어' })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({ description: '변경 유형 (신설, 폐지 등)' })
  @IsOptional()
  @IsString()
  type?: string;
}
