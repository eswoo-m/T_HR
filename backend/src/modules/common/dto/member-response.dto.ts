// src/organization/dto/member-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MemberResponseDto {
  @ApiProperty({ example: 'emp_001', description: '멤버 고유 ID' })
  id: string; // 💡 number에서 string으로 수정!

  @ApiProperty({ example: '홍길동', description: '이름' })
  name: string;

  @ApiProperty({ example: '부장', description: '직급' })
  jobRole: string;

  @ApiProperty({ example: 'STE본부', description: '상위 부서명' })
  parentName: string;

  @ApiProperty({ example: 'STE1팀', description: '팀명' })
  teamName: string;
}
