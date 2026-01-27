import { PartialType } from '@nestjs/swagger';
import { RegisterProjectDto } from './register-project.dto';

/**
 * 프로젝트 수정 DTO
 * RegisterProjectDto의 모든 필드를 상속받으며,
 * PartialType에 의해 모든 필드가 자동적으로 @IsOptional() 처리가 됩니다.
 */
export class UpdateProjectDto extends PartialType(RegisterProjectDto) {
  // 추가적으로 수정 시에만 필요한 필드가 있다면 여기에 정의합니다.
  // 예: 수정 사유 등 (필요 없다면 비워두셔도 됩니다.)
}
