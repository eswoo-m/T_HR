import { PickType } from '@nestjs/swagger';
import { CustmerDto } from '@modules/dto/custmer.dto';
import { ProjectDto } from '@modules/dto/project.dto';
import { CustomerContactDto } from '@modules/dto/customer-contact.dto';

export class ProjectBasicInfoDto extends PickType(ProjectDto, ['id', 'name', 'startDate', 'endDate', 'status', 'location', 'taskName', 'taskSummary', 'remarks', 'amount', 'headcount'] as const) {
  orgText: string;
  customerName: string;
  customerContacts: CustomerContactDto[];
}
