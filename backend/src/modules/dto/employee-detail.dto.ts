import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsArray, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetDto } from '@modules/dto/asset.dto';

/**
 * [공통] 프로젝트 정보 뼈대
 */
export class ProjectEntryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() id: number | null;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() projectId?: number | null;
  @ApiProperty({ required: false }) @IsString() projectName: string | null;
  @ApiProperty({ required: false }) @IsString() customerName: string | null;
  @ApiProperty({ required: false }) @IsDateString() startDate: string | Date | null;
  @ApiProperty({ required: false }) @IsDateString() endDate: string | Date | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() headcount: number | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() assignedRole: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() taskName: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() taskSummary: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tools: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() workDetail: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contribution: string | null;
}

/**
 * [공통] 자격증 정보
 */
export class CertificateDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() id?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() number?: string;
  @IsString() name: string;
  @IsString() type: string;
  @IsDateString() acquisitionDate: string | Date;
  @IsString() issuingAuthority: string;
}

/**
 * [공통] 역량 및 도구 정보
 */
class TechnicalAbilityDto {
  @IsOptional() @IsString() communication: string | null;
  @IsOptional() @IsString() officeSkill: string | null;
  @IsOptional() @IsString() testDesign: string | null;
  @IsOptional() @IsString() testExecution: string | null;
}

class EmployeeToolDto {
  @IsOptional() @IsString() defectSystem: string | null;
  @IsOptional() @IsString() messenger: string | null;
  @IsOptional() @IsString() apiTool: string | null;
  @IsOptional() @IsString() etcTool: string | null;
}

export class EducationInfoBaseDto {
  @IsOptional() @IsString() level: string | null;
  @IsOptional() @IsString() school: string | null;
  @IsOptional() @IsString() major: string | null;
  @IsOptional() graduationDate: string | Date | null;
  @IsOptional() @IsString() status: string | null;
}

/**
 * 1. 기본 정보 (조회/수정 공통 뼈대)
 */
export class BasicInfoBaseDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() no: string;
  @ApiProperty() @IsString() nameKr: string;
  @ApiProperty() @IsOptional() @IsString() nameEn: string | null;
  @ApiProperty() @IsOptional() @IsString() nameCh: string | null;
  @ApiProperty() @IsString() residentNo: string;
  @ApiProperty() @IsOptional() @IsString() authLevel: string;
  @ApiProperty() @IsDateString() birthDate: string | Date;
  @ApiProperty() @IsBoolean() isLunar: boolean;
  @ApiProperty() @IsString() gender: string;

  @ApiProperty() @IsOptional() @IsNumber() departmentId: number | null;
  @ApiProperty() @IsOptional() @IsString() department: string | null;
  @ApiProperty() @IsOptional() @IsNumber() teamId: number | null;
  @ApiProperty() @IsOptional() @IsString() team: string | null;

  @ApiProperty() @IsOptional() @IsString() jobPosition: string | null;
  @ApiProperty() @IsOptional() @IsString() jobTitle: string | null;
  @ApiProperty() @IsOptional() @IsString() jobRole: string | null;
  @ApiProperty() @IsOptional() @IsString() jobRole2: string | null;

  @ApiProperty() @IsOptional() @IsString() assignStatus: string | null;
  @ApiProperty() @IsOptional() @IsString() email: string | null;
  @ApiProperty() @IsDateString() joinDate: string | Date;
  @ApiProperty() @IsOptional() @IsString() phone: string | null;
  @ApiProperty() @IsOptional() @IsString() type: string | null;
  @ApiProperty() @IsOptional() @IsString() hrStatus: string | null;
  @ApiProperty() @IsOptional() @IsString() skillLevel: string | null;

  @ApiProperty() @IsOptional() @IsDateString() leaveStartDate: string | Date | null;
  @ApiProperty() @IsOptional() @IsDateString() leaveEndDate: string | Date | null;

  @ApiProperty({ type: EducationInfoBaseDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EducationInfoBaseDto)
  education: EducationInfoBaseDto;

  @ApiProperty() @IsOptional() @IsNumber() totalSwExperience: number | null;
  @ApiProperty() @IsOptional() @IsNumber() prevSwExperience: number | null;
  @ApiProperty() @IsOptional() @IsString() maritalStatus: string | null;
  @ApiProperty() @IsOptional() weddingAnniv: string | Date | null;
  @ApiProperty() @IsOptional() @IsString() emergencyPhone: string | null;
  @ApiProperty() @IsOptional() @IsString() emergencyRelation: string | null;
  @ApiProperty() @IsOptional() @IsString() zipCode: string | null;
  @ApiProperty() @IsOptional() @IsString() address: string | null;
  @ApiProperty() @IsOptional() @IsString() addressDetail: string | null;
  @ApiProperty() @IsOptional() @IsString() residenceArea: string | null;
  @ApiProperty() @IsOptional() @IsString() experienceDisplay: string | null;
  @ApiProperty() @IsOptional() @IsString() remarks: string | null;
  @ApiProperty() @IsOptional() @IsString() profileImage: string | null;

  @ApiProperty() @IsOptional() @IsArray() @IsString({ each: true }) previousExperiences: string[] | null;
  @ApiProperty() @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AssetDto) assets: AssetDto[] | null;
}

/**
 * 2. 역량 정보 (조회/수정 공통)
 */
export class SkillsInfoBaseDto {
  @ApiProperty({ type: [CertificateDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateDto)
  certificates: CertificateDto[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => TechnicalAbilityDto)
  technicalAbility: TechnicalAbilityDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeToolDto)
  employeeTool: EmployeeToolDto;
}

/**
 * [최종 응답 DTO] 상세 조회 시 사용
 */
export class EmployeeDetailResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => BasicInfoBaseDto)
  basicInfo: BasicInfoBaseDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SkillsInfoBaseDto)
  skillsInfo: SkillsInfoBaseDto;

  @ApiProperty({ type: [ProjectEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectEntryDto)
  prevProjects: ProjectEntryDto[];

  @ApiProperty({ type: [ProjectEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectEntryDto)
  projects: ProjectEntryDto[];
}

/**
 * [최종 요청 DTO] 정보 수정 시 사용
 * PartialType을 써서 모든 필드를 선택사항(Optional)으로 바꿉니다.
 */
export class UpdateEmployeeDto extends PartialType(EmployeeDetailResponseDto) {}
