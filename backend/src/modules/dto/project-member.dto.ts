import { ProjectAssignmentPeriodDto } from '@modules/dto/project-assignment-period.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProjectMemberDto {
  employeeId: string;
  startDate: string;
  endDate: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  id: number;

  @ApiProperty({ example: '정현구' })
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'PM' })
  @IsOptional()
  jobRole: string;

  @ApiProperty({ example: '공공사업본부' })
  @IsOptional()
  parentName: string;

  @ApiProperty({ example: '개발1팀' })
  @IsOptional()
  teamName: string;

  projectAssignmentPeriod: ProjectAssignmentPeriodDto[];
}
