import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsInt, IsString, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeDTO } from '@modules/dto/employee.dto';

// 1. 하위 DTO: 전직장 경력
export class PreProjectAssignmentDto {
  @ApiProperty({ description: '직장명', example: '(주)티벨' })
  @IsString()
  companyName: string;

  @ApiProperty({ description: '근무부서', example: '개발팀' })
  @IsString()
  department: string;

  @ApiProperty({ description: '최종 직급', example: '과장' })
  @IsString()
  jobPosition: string;

  @ApiProperty({ description: '담당업무', example: '프론트 개발자' })
  @IsString()
  @IsOptional()
  jobRole: string;

  @ApiProperty({ description: '담당업무', example: '프론트 개발자' })
  @IsString()
  @IsOptional()
  jobRole2: string;

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

// 2. 하위 DTO: 자격증
export class CertificateDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '구분 코드 (CERT: 취득, COMPL: 수료)', example: 'CERT' })
  @IsString()
  type: string;

  @ApiProperty({ description: '자격증번호', example: '12345' })
  @IsString()
  number: string;

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

  @ApiPropertyOptional({ description: '자격증 비고' })
  @IsArray()
  @IsOptional()
  remarks?: string;
}

// 3. 메인 DTO: 신규 사원 등록
export class RegisterEmployeeDto extends EmployeeDTO {
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

  @ApiPropertyOptional({ description: '졸업일시', example: '2028-05-20' })
  @IsDateString()
  @IsOptional()
  graduationDate?: string;

  @ApiProperty({ description: '졸업여부', example: '졸업, 휴업' })
  @IsString()
  @IsOptional()
  eduStatus?: string;

  // --- 하위 DTO 중첩 ---
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

  @ApiPropertyOptional({ description: '결혼기념일 (YYYY-MM-DD)', example: '2020-05-20' })
  @IsDateString()
  @IsOptional()
  weddingAnniv?: string;

  @ApiPropertyOptional({ description: '비상연락처', example: '010-9999-9999' })
  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @ApiPropertyOptional({ description: '비상연락망 관계', example: '배우자' })
  @IsString()
  @IsOptional()
  emergencyRelation?: string;

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

  @ApiProperty({ description: '상세 주소', example: '101동 202호' })
  @IsString()
  @IsOptional()
  residenceArea?: string;

  @ApiPropertyOptional({ description: '프로필 사진 경로 (직접 입력 시)', example: '/uploads/profiles/2026/01/photo.jpg' })
  @IsString()
  @IsOptional()
  profilePath?: string;

  @ApiPropertyOptional({ description: '프로필 이미지 Base64 데이터', example: 'data:image/png;base64,iVBORw0KGgo...' })
  @IsString()
  @IsOptional()
  profileImageBase64?: string;

  @ApiPropertyOptional({ description: '할당할 자산 ID 목록', example: '[1, 5, 10]' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assetIds?: number[];
}
