import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CustomerContactDto {
  @ApiProperty({ example: 1, description: '기존 담당자 ID (신규일 경우 생략)', required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ example: '홍길동' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: '팀장', required: false })
  @IsOptional()
  @IsString()
  jobRole?: string;

  @ApiProperty({ example: '서비스사업팀', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'test@test.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '010-1234-5678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '02-1234-5678', required: false })
  @IsOptional()
  @IsString()
  tel?: string;

  @ApiProperty({ example: '특이사항 작성', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({ example: false, description: '주 담당자 여부 (생략 시 false)', required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;
}
