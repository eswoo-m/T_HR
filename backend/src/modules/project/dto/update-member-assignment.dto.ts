import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectAssignmentPeriodDto } from '@common/dto/project-assignment-period.dto';
import { MonthlyMmDto } from '@common/dto/monthly_mm.dto';

export class UpdateMemberAssignmentDto {
  @ApiProperty({ type: [ProjectAssignmentPeriodDto], description: '투입 기간 상세 리스트' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAssignmentPeriodDto)
  periods: ProjectAssignmentPeriodDto[];

  // 필요시 월별 M/M를 직접 수정할 수 있도록 추가
  @ApiProperty({ type: [MonthlyMmDto], description: '월별 M/M 상세 리스트', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthlyMmDto)
  monthly?: MonthlyMmDto[];
}
