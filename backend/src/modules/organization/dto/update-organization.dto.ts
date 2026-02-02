import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({
    example: '플랫폼 서비스의 백엔드 개발 및 인프라 운영 담당',
    description: '조직 상세 설명 (수정 가능 항목)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  desc?: string;
}
