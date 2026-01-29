import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { formatDate } from '../utils/date.util';

export class ProjectDto {
  @ApiProperty({ example: 101 })
  id: number;

  @ApiProperty({ example: '차세대 시스템 구축', description: '프로젝트명' })
  name: string;

  @ApiProperty({ example: '2023-01-01', description: '시작일' })
  @Transform(({ value }) => formatDate(value))
  startDate: string;

  @ApiProperty({ example: '2023-12-31', description: '종료일' })
  @Transform(({ value }) => formatDate(value))
  endDate: string;
}
