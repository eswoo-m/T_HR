import { PickType } from '@nestjs/swagger';
import { CustmerDto } from '../../../dto/custmer.dto';

export class CustomerSummaryDto {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  ongoingProjectCount: number;
}

export class CustomerListItemDto extends PickType(CustmerDto, ['id', 'name', 'ceoName', 'industry', 'tel', 'status', 'remarks'] as const) {
  activeProjectCount: number;
  totalProjectCount: number;
}

export class CustomerListWithSummaryResponseDto {
  summary: CustomerSummaryDto;
  list: CustomerListItemDto[];
}
