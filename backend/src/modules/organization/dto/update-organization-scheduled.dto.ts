import { IsNumber, IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

export class UpdateOrganizationScheduledDto {
  @IsNumber()
  id: number;

  @IsString()
  organization: string;

  @IsString()
  department: string;

  @IsString()
  date: string; // YYYY-MM-DD

  @IsEnum(['신설', '폐지'])
  type: '신설' | '폐지';

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  projectId: number; // 0이면 연결 없음

  @IsString()
  @IsOptional()
  projectName: string;

  @IsString()
  @IsOptional()
  projectPeriod: string;

  @IsArray()
  members: { id: string; name: string; position: string }[];
}
