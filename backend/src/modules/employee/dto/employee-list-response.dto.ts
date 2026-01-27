import { ApiProperty } from '@nestjs/swagger';

export class EmployeeListResponseDto {
  @ApiProperty({ description: '사원 식별자(ID)', example: 1 })
  id: number;

  @ApiProperty({ description: '사번', example: '2026001' })
  employeeNo: string;

  @ApiProperty({ description: '성명(국문)', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '실(부서) 명칭', example: '소프트웨어사업실' })
  departmentName: string;

  @ApiProperty({ description: '소속 팀 명칭', example: '개발1팀' })
  teamName: string;

  @ApiProperty({ description: '현재 배정 상태', example: '퉁입_정산' })
  assignStatus: string;

  @ApiProperty({ description: '기술 등급', example: '고급' })
  skillLevel: string;

  @ApiProperty({ description: '총 경력(표시용)', example: '5년 2개월' })
  totalCareerDisplay: string;

  @ApiProperty({ description: '보유 자격증 개수', example: 3 })
  certificateCount: number;
}
