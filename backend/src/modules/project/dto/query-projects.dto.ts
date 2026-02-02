import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryProjectsDto {
  @ApiProperty({ description: '검색어 (프로젝트명, 고객사명)', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: '부서 ID', required: false })
  @IsOptional()
  @Type(() => Number) // 쿼리 스트링 문자열을 숫자로 변환
  @IsNumber()
  departmentId?: number;

  @ApiProperty({ description: '팀 ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamId?: number;

  @ApiProperty({ description: '진행 단계 (상태)', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  // 💡 추가된 필드들 (에러 해결 핵심)
  @IsOptional()
  @Type(() => Number)
  minHeadcount?: number;

  @IsOptional()
  @Type(() => Number)
  maxHeadcount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  minAmount?: number;

  @IsOptional()
  @Type(() => Number)
  maxAmount?: number;
}
