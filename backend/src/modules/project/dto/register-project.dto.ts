import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, IsString, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { CustomerContactDto } from '../../common/dto/contact.dto';
import { ProjectAssignmentDto } from '@common/dto/project-assignment.dto';
import { Type } from 'class-transformer';

export class RegisterProjectDto {
  @ApiProperty({ example: '2026년 차세대 시스템 구축' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 8, description: '고객사 ID', required: false })
  @IsOptional()
  @IsInt()
  customerId?: number;

  @ApiProperty({ example: 7, description: '담당 부서 ID', required: false })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @ApiProperty({ example: 11, description: '담당 부서 ID', required: false })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiProperty({ example: '2026-02-01', description: '시작일' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2026-12-31', description: '종료일' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 5, description: '투입 인원수' })
  @IsOptional()
  @IsInt()
  headcount?: number;

  @ApiProperty({ example: 50000000.0, description: '계약 금액' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: '진행', description: '진행상태' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '고객사 상주', description: '근무지' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '백엔드 API 개발', description: '업무명' })
  @IsOptional()
  @IsString()
  taskName?: string;

  @ApiProperty({ example: 'NestJS 기반 마이크로서비스 구축', description: '업무 요약' })
  @IsOptional()
  @IsString()
  taskSummary?: string;

  @ApiProperty({ example: '매주 금요일 주간 보고 진행', description: '특이사항' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({
    description: `
    프로젝트 담당자 리스트입니다. 
    1. 기존 담당자: id 값만 전달
    2. 신규 담당자: id 없이 이름, 이메일 등 정보 전달
  `,
    example: [{ id: 7 }, { id: 8 }, { name: '이순신', email: 'new@test.com', phone: '010-9999-8888', jobRole: '차장', department: '구매부' }],
    type: [CustomerContactDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerContactDto)
  contacts?: CustomerContactDto[];

  @ApiProperty({
    description: '투입 인력 상세 정보 (인력별 역할 및 상세 기간 포함)',
    type: [ProjectAssignmentDto],
    required: false,
    example: [
      {
        employeeId: 'hg.jeong',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        assignedRole: 'PM',
        projectAssignment: [
          {
            employeeId: 'hg.jeong',
            status: '투입_정산',
            startDate: '2026-02-01',
            endDate: '2026-06-30',
          },
          {
            employeeId: 'hg.jeong',
            status: '투입_지원',
            startDate: '2026-07-01',
            endDate: '2026-12-31',
          },
        ],
      },
      {
        employeeId: 'gh.jeon',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        assignedRole: 'Backend Developer',
        projectAssignment: [
          {
            employeeId: 'gh.jeon',
            status: '투입_정산',
            startDate: '2026-02-01',
            endDate: '2026-12-31',
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAssignmentDto)
  projectAssignment?: ProjectAssignmentDto[];
}
