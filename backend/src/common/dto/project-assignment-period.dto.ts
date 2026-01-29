import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { formatDate } from '../utils/date.util';
import { IsOptional, IsString } from 'class-validator';

export class ProjectAssignmentPeriodDto {
  @ApiProperty({ example: 'hg.jeong', description: '직원 ID' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: '투입_정산', description: '상태' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2026-02-01', description: '상세 시작일' })
  @IsString()
  @Transform(({ value }) => formatDate(value))
  startDate: string;

  @ApiProperty({ example: '2026-06-30', description: '상세 종료일' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => formatDate(value))
  endDate?: string;
}
