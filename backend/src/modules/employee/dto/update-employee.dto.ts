import { IsString, IsOptional, IsArray, IsDate, ValidateNested, IsInt, IsEmail, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// --- 내부 DTO 클래스들 ---

export class TechnicalAbilityDto {
  @IsString() @IsOptional() communication?: string;
  @IsString() @IsOptional() officeSkill?: string;
  @IsString() @IsOptional() testDesign?: string;
  @IsString() @IsOptional() testExecution?: string;
}

export class CertificateDto {
  @IsString() name: string;
  @IsString() type: string;
  @IsDateString() acquisitionDate: Date;
  @IsDateString() @IsOptional() expDate: Date;
  @IsString() issuingAuthority: string;
  @IsArray() @IsOptional() attachmentPaths?: string;
}

export class ProjectAssignmentDto {
  @IsString() projectId: string; // 연결할 프로젝트 ID
  @IsDate() @Type(() => Date) startDate: Date;
  @IsDate() @IsOptional() @Type(() => Date) endDate?: Date;
  @IsString() @IsOptional() assignedRole?: string;
  @IsString() @IsOptional() tools?: string;
  @IsString() @IsOptional() workDetail?: string;
  @IsString() @IsOptional() contribution?: string;
}

export class UpdateEmployeeDto {
  // 1. 사원 기본 정보 (Employee)
  @ApiProperty({ description: '영어 성명', example: 'Hong Gil Dong', required: false })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiProperty({ description: '한자 성명', example: '洪吉童', required: false })
  @IsString()
  @IsOptional()
  nameCh?: string;
  //
  // @ApiProperty({ description: '로그인 비밀번호', example: 'password123!' })
  // @IsString()
  // @IsNotEmpty()
  // password: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'email', example: 'test@company.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '실 ID', example: 1 })
  @IsInt()
  @IsOptional()
  departmentId: number;

  @ApiProperty({ description: '팀 ID', example: 10 })
  @IsInt()
  @IsOptional()
  teamId: number;

  @ApiProperty({ description: '현 근무하는 부서 ID', example: 10 })
  @IsInt()
  @IsOptional()
  deptId: number;

  @ApiProperty({ description: '권한 코드 (CommonCode)', example: 'USER' })
  @IsOptional()
  authLevel?: string;

  @ApiProperty({ description: '직급', example: '과장' })
  @IsString()
  @IsOptional()
  jobLevel?: string;

  @ApiProperty({ description: '직책', example: '팀장, 실장,' })
  @IsString()
  @IsOptional()
  jobRole?: string;

  @ApiProperty({ description: '상태', example: '투입_정산, 투입_지원, 대기, 관리' })
  @IsString()
  @IsOptional()
  assignStatus?: string;

  @ApiProperty({ description: '직원 유형 코드 (CommonCode)', example: 'REGULAR' })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: '최종 학력 (박사, 석사, 학사, 전문학사, 고졸)', example: '학사' })
  @IsString()
  @IsOptional()
  eduLevel?: string;

  @ApiProperty({ description: '최종 학교', example: '한국대학교' })
  @IsString()
  @IsOptional()
  lastSchool?: string;

  @ApiProperty({ description: '전공', example: '컴퓨터공학' })
  @IsString()
  @IsOptional()
  major?: string;

  @ApiProperty({ description: '결혼 상태 코드 (CommonCode)', example: 'SINGLE' })
  @IsOptional()
  maritalStatus?: string;

  @ApiProperty({ description: '우편번호', example: '06123' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ description: '주소', example: '서울시 강남구...' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '상세 주소', example: '101동 202호' })
  @IsString()
  @IsOptional()
  addressDetail?: string;

  @ApiPropertyOptional({ description: '프로필 사진 경로', example: '/uploads/profiles/2026/01/photo.jpg' })
  @IsString()
  @IsOptional()
  profilePath?: string;

  @ApiPropertyOptional({ description: '할당할 자산 ID 목록', example: '[1, 5, 10]' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assetIds?: number[];

  // 2. 사원 상세 정보 (EmployeeDetail)
  @IsString()
  hrStatus: string; // 재직, 휴직, 퇴사 등

  @IsString()
  skillLevel: string; // 초급, 중급, 고급 등

  // 3. 기술 역량 (TechnicalAbility - 1:1 관계 객체)
  @IsOptional()
  @ValidateNested()
  @Type(() => TechnicalAbilityDto)
  technicalAbility?: TechnicalAbilityDto;

  // 4. 자격증 (Certificates - 1:N 관계 배열)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificateDto)
  certificates?: CertificateDto[];

  // 5. 프로젝트 투입 이력 (ProjectAssignment - 1:N 관계 배열)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectAssignmentDto)
  projects?: ProjectAssignmentDto[];
}
