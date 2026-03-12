import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDTO } from '@modules/dto/employee.dto';

export class EmployeeResponseDto extends EmployeeDTO {
  @ApiProperty({ description: '부서명' })
  departmentName: string;

  @ApiProperty({ description: '실(Division)명' })
  divisionName: string;

  @ApiProperty({ description: '경력' })
  experienceDisplay: number;

  // @ApiProperty({ description: '기술 레벨', example: '초급, 중급, 고급, 특급' })
  // techLevel: string;

  @ApiProperty({ description: '보유 자격증 개수' })
  certificateCount: number;
}

// 목록 조회를 위한 래퍼 DTO (선택 사항)
export class EmployeeListResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '전체 개수' })
  count: number;

  @ApiProperty({ type: [EmployeeResponseDto], description: '사원 목록' })
  data: EmployeeResponseDto[];
}
