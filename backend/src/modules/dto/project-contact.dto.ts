import { ApiProperty } from '@nestjs/swagger';

export class ProjectContactDto {
  @ApiProperty({ example: 101 })
  id: number;

  @ApiProperty({ example: '1', description: '프로젝트 ID' })
  projectId: number;

  @ApiProperty({ example: 'LG전자 통합 테스트 관리', description: '프로젝트명' }) // 추가
  projectName: string;

  @ApiProperty({ example: '2', description: '고객사 ID' })
  contactId: number;

  @ApiProperty({ example: '2026-01-01', description: '등록일자' })
  regTime: Date;
}
