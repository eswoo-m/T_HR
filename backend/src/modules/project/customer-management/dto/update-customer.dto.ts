import { PartialType } from '@nestjs/swagger';
import { CustmerDto } from '../../../dto/custmer.dto';

export class UpdateCustomerDto extends PartialType(CustmerDto) {}
