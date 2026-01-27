import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiParam } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerListWithSummaryResponseDto, CustomerDetailResponseDto } from './dto/customer-response.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';

@ApiTags('프로젝트 / 고객사관리')
@Controller('projects/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  @ApiOperation({ summary: '고객사 신규 등록' })
  @ApiCreatedResponse({ description: '등록 성공', type: CustomerDetailResponseDto })
  @ApiBadRequestResponse({ description: '유효성 검사 실패 (필수 필드 누락, 형식 오류 등)' })
  @ApiConflictResponse({ description: '이미 존재하는 사업자등록번호입니다.' })
  @ApiInternalServerErrorResponse({ description: '서버 내부 오류 (DB 트랜잭션 실패 등)' })
  async register(@Body() dto: RegisterCustomerDto) {
    return this.customerService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: '고객사 관리 목록' })
  @ApiResponse({ status: 200, description: '고객사 목록 및 요약 데이터 조회 성공', type: CustomerListWithSummaryResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청 파라미터' })
  @ApiResponse({ status: 500, description: '서버 오류 발생' })
  async query(dto: QueryCustomerDto): Promise<CustomerListWithSummaryResponseDto> {
    return this.customerService.query(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '고객사 상세 조회', description: '고객사의 기본 정보와 담당자 목록, 프로젝트 이력을 상세조회합니다.' })
  @ApiOkResponse({ description: '상세 정보 조회 성공', type: CustomerDetailResponseDto })
  @ApiNotFoundResponse({ description: '존재하지 않는 고객사 ID입니다.' })
  @ApiBadRequestResponse({ description: 'ID 형식이 올바르지 않습니다.' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.get(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '고객사 정보 수정' })
  @ApiParam({ name: 'id', description: '고객사 고유 ID', example: 1 })
  async update(@Param('id') id: number, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '고객사 삭제', description: '고객사와 연결된 모든 담당자 정보를 함께 삭제합니다.' })
  @ApiParam({ name: 'id', description: '삭제할 고객사 ID', example: 1 })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '고객사 없음' })
  async delete(@Param('id') id: number) {
    return this.customerService.delete(id);
  }
}
