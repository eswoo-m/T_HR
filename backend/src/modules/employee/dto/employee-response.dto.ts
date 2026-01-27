import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ description: '사원 ID' })
  id: string;

  @ApiProperty({ description: '성명(한글)' })
  nameKr: string;

  @ApiProperty({ description: '직급' })
  level: string;

  @ApiProperty({ description: '역할' })
  role: string;

  @ApiProperty({ description: '부서명' })
  departmentName: string;

  @ApiProperty({ description: '실(Division)명' })
  divisionName: string;

  @ApiProperty({ description: '구분', example: '관리, 투입정산, 투입지원, 대기' })
  status: string; // 현재 상태 구분

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
