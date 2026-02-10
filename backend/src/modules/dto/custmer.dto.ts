import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ContactDto } from './contact.dto';
import { ProjectDto } from './project.dto';

export class CustmerDto {
  @ApiProperty({ example: 1, description: '고객사 ID', required: false })
  id: number;

  @ApiProperty({ example: '티벨', description: '고객사 이름', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: '1234-5678-90', description: '사업자등록번호' , required: false})
  @IsString()
  @IsOptional()
  businessNo: string;

  @ApiProperty({ example: '1234-5678-90', description: '대표이름', required: false })
  @IsString()
  @IsOptional()
  ceoName: string;

  @ApiProperty({ example: '정보통신', description: '업종', required: false })
  @IsOptional()
  @IsString()
  industry: string;

  @ApiProperty({ example: '7777-9113', description: '대표전화번호', required: false })
  @IsOptional()
  @IsString()
  tel: string;

  @ApiProperty({ example: '7610-7540', description: '팩스', required: false })
  @IsOptional()
  @IsString()
  fax: string;

  @ApiProperty({ example: '서울시 강남구 테헤란로', description: '회사주소', required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ example: 'https//tbell.co.kr', description: '홈페이지 주소', required: false })
  @IsOptional()
  @IsString()
  homepage: string;

  @ApiProperty({ example: '활성 / 휴면 / 종료', description: '상태', required: false })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({ example: '주력 사업 진행', description: '특이사항', required: false })
  @IsOptional()
  @IsString()
  remarks: string;

  @ApiProperty({ example: '2026-01-01', description: '등록일자', required: false })
  regTime: Date;

  @ApiProperty({ type: [ContactDto], description: '연결된 담당자 목록', required: false })
  @IsOptional()
  contacts: ContactDto[];

  @ApiProperty({ type: [ProjectDto], description: '프로젝트 이력 목록', required: false })
  @IsOptional()
  projects: ProjectDto[];
}
