import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: 15, description: '소속 구성원 총 인원수' })
  memberCount: number;

  @ApiProperty({ description: '진행 중인 프로젝트 목록' })
  activeProject: {
    name: string;
    period: string; // "2024.01 ~ 2026.12"
  } | null;

  @ApiProperty({ description: '하위 조직 목록' })
  subOrganizations: {
    id: number;
    name: string;
    description: string;
  }[];

  @ApiProperty({ description: '구성원 리스트' })
  members: {
    id: string;
    name: string;
    jobRole: string;
  }[];
}
