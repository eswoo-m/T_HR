import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectContactDto } from './project-contact.dto';

export class CustomerContactDto {
  @ApiProperty({ example: 101, required: false })
  @IsOptional()
  @IsNumber() // 💡 데코레이터가 있어야 파싱됩니다!
  id?: number;

  @ApiProperty({ example: '홍길동', description: '담당자 이름' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: '팀장', description: '직책' })
  @IsOptional()
  @IsString()
  jobRole: string;

  @ApiProperty({ example: '서비스사업팀', description: '부서' })
  @IsOptional()
  @IsString()
  department: string;

  @ApiProperty({ example: '02-1234-12345', description: '전화번호' })
  @IsOptional()
  @IsString()
  tel: string;

  @ApiProperty({ example: 'test@test.com', description: '이메일' })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ example: '010-1234-5678', description: '연락처' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ example: '주력사업', description: '특이사항' })
  @IsOptional()
  @IsString()
  remarks: string;

  @ApiProperty({ example: true, description: '주담당자 여부' })
  @IsOptional()
  @IsBoolean()
  isPrimary: boolean;

  // 중간 테이블 정보는 생성 시 필수가 아닐 수 있으므로 Optional 처리 ㅋ
  @ApiProperty({ type: () => [ProjectContactDto], description: '담당프로젝트', required: false })
  @IsOptional()
  @IsArray()
  projectContacts?: any[];
}
