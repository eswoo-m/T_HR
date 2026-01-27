import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmployeeMonthlyService } from './employee-monthly.service';
import { QueryMonthlyListDto } from './dto/query-monthly-list.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('인사관리 / 공수현황')
@Controller('employee-monthly')
export class EmployeeMonthlyController {
  constructor(private readonly employeeMonthlyService: EmployeeMonthlyService) {}

  @Get()
  @ApiOperation({
    summary: '월별 공수 현황 리스트 조회',
    description: '검색 조건에 맞는 사원들의 월별 공수 및 프로젝트별 투입 현황을 조회합니다.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async query(@Query() dto: QueryMonthlyListDto) {
    return this.employeeMonthlyService.query(dto);
  }
}
