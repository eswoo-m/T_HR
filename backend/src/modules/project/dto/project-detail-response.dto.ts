import { ProjectBasicInfoDto } from '@modules/dto/project-basic.dto';
import { ProjectMemberDto } from '@modules/dto/project-member.dto';

export class ProjectDetailResponseDto {
  basicInfo: ProjectBasicInfoDto;
  members: ProjectMemberDto[];
}
