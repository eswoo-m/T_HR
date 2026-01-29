import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProjectAssignmentPeriodDto } from '@common/dto/project-assignment-period.dto';
import { Type } from 'class-transformer';

/**
 * 2. 부모 DTO
 */
export class ProjectAssignmentDto {
  @ApiProperty({ example: 'hg.jeong', description: '직원 ID' })
  @IsOptional()
  @IsString()
  employeeId: string;

  @ApiProperty({ example: '2026-02-01', description: '투입 시작일' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ example: '2026-12-31', description: '투입 종료일' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ example: 'PM', description: '담당 역할' })
  @IsOptional()
  @IsString()
  assignedRole?: string;

  @ApiProperty({
    description: '인력별 상세 투입 기간 리스트',
    type: [ProjectAssignmentPeriodDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAssignmentPeriodDto) // ✅ 위에서 정의한 클래스를 참조
  projectAssignment: ProjectAssignmentPeriodDto[];
}
