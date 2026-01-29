import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../../../common/dto/project.dto';

export class CustomerSummaryDto {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  ongoingProjectCount: number;
}

export class CustomerListItemDto {
  id: number;
  name: string;
  ceoName: string;
  industry: string;
  tel: string;
  activeProjectCount: number;
  totalProjectCount: number;
  status: string;
}

export class CustomerListWithSummaryResponseDto {
  summary: CustomerSummaryDto;
  list: CustomerListItemDto[];
}

export class ContactDto {
  @ApiProperty({ example: 101 })
  id: number;

  @ApiProperty({ example: '홍길동', description: '담당자 이름' })
  name: string;

  @ApiProperty({ example: '팀장', description: '직책' })
  jobRole: string;

  @ApiProperty({ example: '서비스사업팀', description: '부서' })
  department: string;

  @ApiProperty({ example: '02-1234-12345', description: '전화번호' })
  tel: string;

  @ApiProperty({ example: 'test@test.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: '010-1234-5678', description: '연락처' })
  phone: string;

  @ApiProperty({ example: '주력사업', description: '특이사항' })
  remarks: string;

  @ApiProperty({ example: true, description: '주담당자 여부' })
  isPrimary: boolean;
}

export class CustomerDetailResponseDto {
  @ApiProperty({ example: 1, description: '고객사 ID' })
  id: number;

  @ApiProperty({ example: '티벨', description: '고객사 이름' })
  name: string;

  @ApiProperty({ example: '1234-5678-90', description: '사업자등록번호' })
  businessNo: string;

  @ApiProperty({ example: '1234-5678-90', description: '대표이름' })
  ceoName: string;

  @ApiProperty({ example: '7777-9113', description: '대표전화번호' })
  tel: string;

  @ApiProperty({ example: '7610-7540', description: '팩스' })
  fax: string;

  @ApiProperty({ example: '서울시 강남구 테헤란로', description: '회사주소' })
  address: string;

  @ApiProperty({ example: 'https//tbell.co.kr', description: '홈페이지 주소' })
  homepage: string;

  @ApiProperty({ example: '활성 / 비활성', description: '상태' })
  status: string;

  @ApiProperty({ example: '주력 사업 진행', description: '특이사항' })
  remarks: string;

  @ApiProperty({ example: '2026-01-01', description: '등록일자' })
  regTime: Date;

  @ApiProperty({ type: [ContactDto], description: '연결된 담당자 목록' })
  contacts: ContactDto[];

  @ApiProperty({ type: [ProjectDto], description: '프로젝트 이력 목록' })
  projects: ProjectDto[];
}
