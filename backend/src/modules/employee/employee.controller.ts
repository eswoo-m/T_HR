import { Controller, Post, Get, Body, Query, UseGuards, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { EmployeeService } from './employee.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { EmployeeListResponseDto } from './dto/employee-list-response.dto';
import { EmployeeDetailResponseDto } from './dto/employee-detail-response.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { Employee as User } from '@prisma/client';

@ApiTags('인사관리')
@Controller('employee') // 접속 주소: /employee
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '신규 사원 등록', description: '사원 기본 정보 및 경력, 자격증, 파일을 한 번에 등록합니다.' })
  @ApiResponse({ status: 201, description: '등록 성공' })
  @ApiResponse({ status: 400, description: '입력 값 유효성 검사 실패' })
  @ApiResponse({ status: 409, description: '사번 또는 주민번호 중복' })
  @ApiResponse({ status: 500, description: '서버 내부 트랜잭션 오류' })
  async register(
    @Body() registerEmployeeDto: RegisterEmployeeDto,
    @GetUser() admin: User, // 커스텀 데코레이터로 로그인한 관리자 정보 획득
  ) {
    return this.employeeService.register(registerEmployeeDto, admin.id);
  }

  @Get()
  @ApiOperation({
    summary: '사원 목록 조회',
    description: '검색 조건(이름, 사번, 부서, 자격증 등)에 따라 사원 목록을 조회합니다.',
  })
  @ApiOperation({ summary: '사원 목록 조회', description: '필터 조건에 맞는 사원 리스트를 반환합니다.' })
  @ApiResponse({ status: 200, description: '조회 성공', type: EmployeeListResponseDto, isArray: true })
  @ApiResponse({ status: 400, description: '잘못된 요청 (파라미터 오류 등)' })
  @ApiResponse({ status: 500, description: '서버 내부 오류 (DB 연결 실패 등)' })
  async query(@Query() dto: QueryEmployeeDto) {
    // console.log('DTO 데이터:', dto);
    return this.employeeService.query(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '사원 상세 조회', description: '특정 사원의 모든 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '사원 식별자', example: 'gd.hong' })
  @ApiResponse({ status: 200, type: EmployeeDetailResponseDto })
  @ApiResponse({ status: 404, description: '사원을 찾을 수 없음' })
  async get(@Param('id') id: string) {
    const result = await this.employeeService.get(id);
    return result;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사원 통합 정보 업데이트', description: '사원 기본 정보, 상세, 역량, 프로젝트 이력을 한 번에 업데이트합니다.' })
  @ApiResponse({ status: 200, description: '업데이트 성공' })
  @ApiResponse({ status: 404, description: '사원을 찾을 수 없음' })
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeeService.update(id, updateEmployeeDto);
  }
}
