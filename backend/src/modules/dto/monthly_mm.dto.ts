import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { formatDate } from '../../common/utils/date.util';

export class MonthlyMmDto {
  @ApiProperty({ example: '202405' })
  yearMonth: string;

  @ApiProperty({ example: '2024-05-01' })
  @Transform(({ value }) => formatDate(value))
  startDate: Date;

  @ApiProperty({ example: '2024-05-31' })
  @Transform(({ value }) => formatDate(value))
  endDate: Date;

  @ApiProperty({ example: '투입_정산' })
  assignStatus: string;

  @ApiProperty({ example: 1.0 })
  mmValue: number; // Decimal -> number로 변환하여 전달
}
