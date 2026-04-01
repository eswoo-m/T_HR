import { IsString, IsInt, Matches, IsOptional, IsBoolean, IsEmail, IsDate, IsNotEmpty, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeDTO {
  @IsInt()
  @IsOptional()
  seq?: number;

  @ApiProperty({ description: 'ID', example: 'gd.hong' })
  @IsString()
  @IsNotEmpty({ message: 'ID 필수 입력 항목입니다.' })
  id: string;

  @ApiProperty({ description: '사번', example: '260101' })
  @IsString()
  @IsNotEmpty({ message: '사번은 필수 입력 항목입니다.' })
  no: string;

  @ApiProperty({ description: '한국어 성명', example: '홍길동' })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  nameKr: string;

  @ApiProperty({ description: '영어 성명', example: 'Hong Gil Dong', required: false })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiProperty({ description: '한자 성명', example: '洪吉童', required: false })
  @IsString()
  @IsOptional()
  nameCh?: string;

  @ApiProperty({ description: '주민등록번호', example: '900101-1234567' })
  @IsString()
  @IsNotEmpty()
  residentNo: string;

  @ApiProperty({ description: '로그인 비밀번호', example: 'password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '생년월일 (YYYY-MM-DD)', example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ description: '음력 여부 (true: 음력, false: 양력)', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isLunar: boolean;

  @ApiProperty({ description: '성별 코드 (CommonCode)', example: '남' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ description: '실 ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ description: '팀 ID', example: 10 })
  @IsInt()
  @IsOptional()
  teamId: number;

  @ApiProperty({ description: '현 근무하는 부서 ID', example: 10 })
  @IsInt()
  @IsNotEmpty()
  deptId: number;

  @ApiProperty({ description: '직급', example: '과장' })
  @IsString()
  @IsOptional()
  jobPosition?: string;

  @ApiProperty({ description: '직책', example: '파트장, 팀장, 실장' })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiProperty({ description: '직무', example: '테스터, 개발자, 경영지원' })
  @IsString()
  @IsOptional()
  jobRole?: string;

  @ApiProperty({ description: '직무', example: '테스터, 개발자, 경영지원' })
  @IsString()
  @IsOptional()
  jobRole2?: string;

  @ApiProperty({ description: '상태', example: '투입_정산, 투입_지원, 대기, 관리' })
  @IsString()
  @IsOptional()
  assignStatus?: string;

  @ApiProperty({ description: '권한 코드 (CommonCode)', example: 'USER' })
  @IsOptional()
  authLevel?: string;

  @ApiPropertyOptional({ description: 'email', example: 'test@company.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '입사일', example: '2026-01-01' })
  @IsDateString()
  @IsNotEmpty()
  joinDate: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  exitDate?: Date;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class EmployeesMonthlyStats {
  employeeId: string;
  assignedSettlement: number;
  assignedSupport: number;
  support: number;
  waiting: number;
  management: number;
}
