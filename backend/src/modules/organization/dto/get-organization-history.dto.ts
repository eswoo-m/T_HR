import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum OrgChangeType {
  ALL = 'ALL',
  NEW = 'NEW', // 신설
  CLOSE = 'CLOSE', // 폐지
}

export class GetOrganizationHistoryDto {
  @ApiProperty({ description: '탭 구분 (past: 과거이력, scheduled: 예정사항)', enum: ['past', 'scheduled'] })
  @IsEnum(['past', 'scheduled'])
  tab: 'past' | 'scheduled';

  @ApiPropertyOptional({ description: '부서명/팀명 검색' })
  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @ApiPropertyOptional({ description: '검색 시작일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '검색 종료일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ enum: OrgChangeType, default: OrgChangeType.ALL })
  @IsOptional()
  @IsEnum(OrgChangeType)
  type?: OrgChangeType = OrgChangeType.ALL;
}
