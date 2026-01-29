import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '@common/dto/project.dto';
import { ProjectAssignmentPeriodDto } from '@common/dto/project-assignment-period.dto';
import { MonthlyMmDto } from '@common/dto/monthly_mm.dto';

export class MemberAssignmentResponseDto {
  // 기본 정보
  @ApiProperty()
  employee: {
    id: string;
    name: string;
    jobRole: string;
    department: string;
    team: string;
  };

  // 프로젝트 정보
  @ApiProperty()
  project: ProjectDto;

  // 상세 보기 섹션 데이터
  @ApiProperty({ type: [ProjectAssignmentPeriodDto] })
  periods: ProjectAssignmentPeriodDto[];

  @ApiProperty({ type: [MonthlyMmDto] })
  monthlyMms: MonthlyMmDto[];
}
