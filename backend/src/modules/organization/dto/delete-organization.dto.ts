import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class OrganizationChangeDto {
  @ApiProperty({ description: '변경/삭제 기준일 (YYYY-MM-DD)' })
  @IsNotEmpty()
  changeDate: string;

  @ApiPropertyOptional({ description: '변경될 부서명' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '변경될 상위부서 ID' })
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ description: '변경될 부서 설명' })
  @IsOptional()
  desc?: string;
}
