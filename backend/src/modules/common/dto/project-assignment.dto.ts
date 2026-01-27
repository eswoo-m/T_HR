import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * 1. 자식 DTO (먼저 선언)
 */
export class ProjectAssignmentPeriodDto {
  @ApiProperty({ example: 'hg.jeong', description: '직원 ID' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: '투입_정산', description: '상태' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2026-02-01', description: '상세 시작일' })
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2026-06-30', description: '상세 종료일' })
  @IsOptional()
  @IsString()
  endDate?: string;
}

/**
 * 2. 부모 DTO
 */
export class ProjectAssignmentDto {
  @ApiProperty({ example: 'hg.jeong', description: '직원 ID' })
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