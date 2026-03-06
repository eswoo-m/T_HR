import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EducationDto {
  @ApiProperty({ example: '고등학교, 대학교', description: '담당자 이름' })
  @IsOptional()
  @IsString()
  level: string;

  @ApiProperty({ example: '서울대학교', description: '학교명' })
  @IsOptional()
  @IsString()
  school: string;

  @ApiProperty({ example: '전공', description: '전공' })
  @IsOptional()
  @IsString()
  major: string;

  @ApiProperty({ example: '1996.03.02', description: '입학일' })
  @IsOptional()
  @IsString()
  admissionDate: string;

  @ApiProperty({ example: '2000.02.20', description: '졸업일' })
  @IsOptional()
  @IsString()
  graduationDate: string;

  @ApiProperty({ example: '졸업, 휴학, 자퇴', description: '구분' })
  @IsOptional()
  @IsString()
  status: string;
}
