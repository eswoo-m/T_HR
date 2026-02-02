import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCustomerDto {
  @ApiPropertyOptional({ description: '고객사명 검색' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '대표자명 검색' })
  @IsOptional()
  @IsString()
  ceoName?: string;

  @ApiPropertyOptional({ description: '거래 상태 필터' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: '페이지 번호', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?;

  @ApiPropertyOptional({ description: '페이지당 노출 개수', default: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?;
}
