import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, ValidateNested, IsNotEmpty, IsString } from 'class-validator';
import { CustomerContactDto } from '../../../common/dto/contact.dto';
import { Type } from 'class-transformer';

export class RegisterCustomerDto {
  @ApiProperty({ example: '가나다산업' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123-45-67890' })
  @IsString()
  @IsNotEmpty()
  businessNo: string;

  @ApiProperty({ example: '김철수', required: false })
  @IsString()
  @IsOptional()
  ceoName?: string;

  @ApiProperty({ example: '02-123-4567', required: false })
  @IsString()
  @IsOptional()
  tel?: string;

  @ApiProperty({ example: '02-123-4567', required: false })
  @IsString()
  @IsOptional()
  fax?: string;

  @ApiProperty({ example: '서울시 강남구 테헤란로', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'https://tbell.co.kr', required: false })
  @IsString()
  @IsOptional()
  homepage?: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ type: [CustomerContactDto], description: '담당자 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerContactDto)
  contacts: CustomerContactDto[];
}
