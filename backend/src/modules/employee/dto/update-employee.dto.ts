import { IsOptional, ValidateNested, IsArray, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CertificateDto } from '@modules/employee/dto/register-employee.dto';

// --- 1. 기본 정보 DTO ---
export class UpdateBasicInfoDto {
  @IsOptional() @IsString() nameEn: string;
  @IsOptional() @IsString() nameCh: string;
  @IsOptional() @IsString() phone: string;
  @IsOptional() @IsString() email: string;
  @IsOptional() @IsNumber() departmentId: number;
  @IsOptional() @IsNumber() teamId: number;
  @IsOptional() @IsString() jobPosition: string;
  @IsOptional() @IsString() jobRole: string;
  @IsOptional() @IsString() jobTitle: string;
  @IsOptional() @IsString() assignStatus: string;
  @IsOptional() @IsString() type: string;
  @IsOptional() @IsString() hrStatus: string;
  @IsOptional() @IsString() eduLevel: string;
  @IsOptional() @IsString() lastSchool: string;
  @IsOptional() @IsString() major: string;

  @IsOptional() @IsString() entranceDate: string;
  @IsOptional() @IsString() graduationDate: string;

  @IsOptional() @IsString() maritalStatus: string;
  @IsOptional() @IsString() zipCode: string;
  @IsOptional() @IsString() address: string;
  @IsOptional() @IsString() addressDetail: string;
  @IsOptional() @IsString() profileImage: string;
}

// --- 2. 역량 정보 DTO ---
class TechnicalAbilityDto {
  @IsOptional() @IsString() communication: string;
  @IsOptional() @IsString() officeSkill: string;
  @IsOptional() @IsString() testDesign: string;
  @IsOptional() @IsString() testExecution: string;
}

class EmployeeToolDto {
  @IsOptional() defectSystem: string;
  @IsOptional() messenger: string;
  @IsOptional() apiTool: string;
  @IsOptional() @IsString() etcTool: string;
}

class UpdateSkillsInfoDto {
  @IsOptional() @IsArray() certificates: CertificateDto[]; // 자격증 배열
  @IsOptional() @ValidateNested() @Type(() => TechnicalAbilityDto) technicalAbility: TechnicalAbilityDto;
  @IsOptional() @ValidateNested() @Type(() => EmployeeToolDto) employeeTool: EmployeeToolDto;
}

// --- 3 & 4. 프로젝트 관련 DTO ---
class ProjectEntryDto {
  @IsOptional() @IsNumber() id: number;
  @IsOptional() @IsNumber() projectId: number;
  @IsOptional() @IsString() projectName: string;
  @IsOptional() @IsString() customerName: string;
  @IsOptional() @IsDateString() startDate: string;
  @IsOptional() @IsDateString() endDate: string;
  @IsOptional() @IsNumber() headcount: number;
  @IsOptional() @IsString() assignedRole: string;
  @IsOptional() @IsString() tools: string;
  @IsOptional() @IsString() workDetail: string;
  @IsOptional() @IsString() contribution: string;
}

// --- 메인 통합 DTO ---
export class UpdateEmployeeDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBasicInfoDto)
  basicInfo: UpdateBasicInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSkillsInfoDto)
  skillsInfo: UpdateSkillsInfoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectEntryDto)
  prevProjects: ProjectEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectEntryDto)
  projects: ProjectEntryDto[];
}
