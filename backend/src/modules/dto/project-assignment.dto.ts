import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested, IsInt } from 'class-validator';
import { ProjectAssignmentPeriodDto } from './project-assignment-period.dto';
import { Type } from 'class-transformer';

// export class ProjectAssignmentDto {
//   @IsString() projectId: string; // 연결할 프로젝트 ID
//   @IsDate() @Type(() => Date) startDate: Date;
//   @IsDate() @IsOptional() @Type(() => Date) endDate?: Date;
//   @IsString() @IsOptional() assignedRole?: string;
//   @IsString() @IsOptional() tools?: string;
//   @IsString() @IsOptional() workDetail?: string;
//   @IsString() @IsOptional() contribution?: string;
// }

/**
 * 2. 부모 DTO
 */
export class ProjectAssignmentDto {
  @ApiProperty({ example: 'hg.jeong', description: '직원 ID' })
  @IsOptional()
  @IsInt()
  projectId: number;

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

  @IsString()
  @IsOptional()
  tools?: string;

  @IsString()
  @IsOptional()
  workDetail?: string;

  @IsString()
  @IsOptional()
  contribution?: string;

  @ApiProperty({
    description: '인력별 상세 투입 기간 리스트',
    type: [ProjectAssignmentPeriodDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAssignmentPeriodDto)
  projectAssignmentPeriod: ProjectAssignmentPeriodDto[];
}
