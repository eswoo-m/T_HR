import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDetailResponseDto {
  // 1. 기본정보 탭
  @ApiProperty({ description: '기본 정보' })
  basicInfo: {
    id: string;
    no: string;
    nameKr: string;
    nameEn: string | null;
    nameCh: string | null;
    residentNo: string;
    birthDate: Date;
    isLunar: boolean;
    gender: string;
    departmentId: number | null;
    teamId: number | null;
    jobLevel: string | null;
    jobRole: string | null;
    assignStatus: string | null;
    email: string | null;
    joinDate: Date;
    phone: string | null;
    type: string | null;
    hrStatus: string | null;
    skillLevel: string | null;
    leaveStartDate: Date | null;
    leaveEndDate: Date | null;
    eduLevel: string | null;
    lastSchool: string | null;
    major: string | null;
    entranceDate: Date | null;
    graduationDate: Date | null;
    totalSwExperience: number | null;
    prevSwExperience: number | null;
    maritalStatus: string | null;
    weddingAnniv: Date | null;
    emergencyPhone: string | null;
    emergencyRelation: string | null;
    zipCode: string | null;
    address: string | null;
    addressDetail: string | null;
    experienceDisplay: string | null;
    remarks: string | null;
    profileImage: string | null;
    previousExperiences: string[] | null;
    assetsList: string[] | null;
  };

  // 2. 역량정보 탭
  @ApiProperty({ description: '역량 정보' })
  skillsInfo: {
    certificates: { name: string; type: string; acquisitionDate: Date; issuingAuthority: string }[];
    technicalAbility: { communication: string | null; officeSkill: string | null; testDesign: string | null; testExecution: string | null };
    employeeTool: { defectSystem: string | null; messenger: string | null; apiTool: string | null; etcTool: string | null };
  };

  // 3. 과거경력 탭
  @ApiProperty({ description: '과거 경력' })
  preProject: {
    projectName: string | null;
    customerName: string | null;
    startDate: Date | null;
    endDate: Date | null;
    headcount: number | null;
    taskName: string | null;
    taskSummary: string | null;
    assignedRole: string | null;
    tools: string | null;
    workDetail: string | null;
    contribution: string | null;
  }[];

  // 4. 프로젝트 경력 탭 (사내 수행 프로젝트)
  @ApiProperty({ description: '프로젝트 경력' })
  projects: {
    projectName: string | null;
    customerName: string | null;
    startDate: Date | null;
    endDate: Date | null;
    headcount: number | null;
    taskName: string | null;
    taskSummary: string | null;
    assignedRole: string | null;
    tools: string | null;
    workDetail: string | null;
    contribution: string | null;
  }[];
}
