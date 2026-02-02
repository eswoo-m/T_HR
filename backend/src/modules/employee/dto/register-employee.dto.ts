import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Matches, IsEmail, IsNotEmpty, IsBoolean, IsString, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 하위DTO
export class PreProjectAssignmentDto {
  @ApiProperty({ description: '직장명', example: '(주)티벨' })
  @IsString()
  companyName: string;

  @ApiProperty({ description: '근무부서', example: '개발팀' })
  @IsString()
  department: string;

  @ApiProperty({ description: '최종 직급', example: '과장' })
  @IsString()
  jobLevel: string;

  @ApiProperty({ description: '담당업무', example: '프론트 개발자' })
  @IsString()
  @IsOptional()
  jobRole: string;

  @ApiProperty({ description: '입사일', example: '2022-03-01' })
  @IsDateString()
  entranceDate: string;

  @ApiProperty({ description: '퇴사일', example: '2022-12-31' })
  @IsDateString()
  @IsOptional()
  resignationDate?: string;

  @ApiProperty({ description: '업무유사성 코드 (CommonCode)', example: 'RELEVANT' })
  @IsOptional()
  relevance?: string;

  @ApiProperty({ description: '담당 업무 상세', example: 'React 개발' })
  @IsString()
  assignedTask: string;
}

export class CertificateDto {
  @ApiProperty({ description: '구분 코드 (CERT: 취득, COMPL: 수료)', example: 'CERT' })
  @IsString()
  type: string;

  @ApiProperty({ description: '자격증/교육 명칭', example: '정보처리기사' })
  @IsString()
  name: string;

  @ApiProperty({ description: '발급/교육 기관', example: '한국산업인력공단' })
  @IsString()
  issuingAuthority: string;

  @ApiProperty({ description: '취득/수료일', example: '2020-05-20' })
  @IsDateString()
  acquisitionDate: string;

  @ApiPropertyOptional({ description: '만료일 (필요 시)', example: '2028-05-20' })
  @IsDateString()
  @IsOptional()
  expDate?: string;

  @ApiPropertyOptional({ type: [String], description: '해당 자격증 첨부파일 경로 리스트' })
  @IsArray()
  @IsOptional()
  attachmentPaths?: string;
}

// 메인DTO
export class RegisterEmployeeDto {
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
  @Matches(/^\d{6}-\d{7}$/, { message: '올바른 주민번호 형식이 아닙니다.' })
  @IsNotEmpty()
  residentNo: string;

  @ApiProperty({ description: '로그인 비밀번호', example: 'password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '입사일', example: '2026-01-01' })
  @IsDateString()
  @IsNotEmpty()
  joinDate: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'email', example: 'test@company.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '생년월일 (YYYY-MM-DD)', example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

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

  @ApiProperty({ description: '권한 코드 (CommonCode)', example: 'USER' })
  @IsOptional()
  authLevel?: string;

  @ApiProperty({ description: '직급', example: '과장' })
  @IsString()
  @IsOptional()
  jobLevel?: string;

  @ApiProperty({ description: '직책', example: '팀장' })
  @IsString()
  @IsOptional()
  jobRole?: string;

  @ApiProperty({ description: '상태', example: '투입_정산, 투입_지원, 대기, 관리' })
  @IsString()
  @IsOptional()
  assignStatus?: string;

  @ApiProperty({ description: '직원 유형 코드 (CommonCode)', example: '정직원' })
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '재직 구분 코드 (CommonCode)', example: '정규직' })
  @IsOptional()
  hrStatus?: string;

  @ApiProperty({ description: '레벨 구분 코드 (CommonCode)', example: '초급' })
  @IsOptional()
  skillLevel?: string;

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

  @ApiPropertyOptional({ type: [PreProjectAssignmentDto], description: '전직장 경력 목록' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PreProjectAssignmentDto)
  previousExperiences?: PreProjectAssignmentDto[];

  @ApiPropertyOptional({ type: [CertificateDto], description: '취득 자격증 목록' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificateDto)
  certificates?: CertificateDto[];

  @ApiProperty({ description: '결혼 상태 코드 (CommonCode)', example: 'SINGLE' })
  @IsOptional()
  maritalStatus?: string;

  @ApiPropertyOptional({ description: '전(SW) 경력 (개월)', example: 12 })
  @IsOptional()
  totalSwExperience?: number;

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
}
