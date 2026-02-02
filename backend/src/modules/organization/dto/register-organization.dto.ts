import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class RegisterOrganizationDto {
  @ApiProperty({ example: '신규개발팀', description: '조직명' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2026-02-01', description: '적용일 (조직 신설일)' })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ example: 1, description: '상위 조직 ID', required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ example: '신규 프로젝트를 위한 개발팀', description: '상세 설명', required: false })
  @IsOptional()
  @IsString()
  desc?: string;
}
