import { Controller, Post, Body, Get, HttpCode, HttpStatus, Param, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiResponse, ApiParam, ApiOkResponse, ApiQuery, ApiOperation, ApiTags, ApiCreatedResponse, ApiConflictResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { RegisterProjectDto } from './dto/register-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateMemberAssignmentDto } from './dto/update-member-assignment.dto';
import { GetMemberAssignmentlDto } from './dto/get-member-assignment.dto';
import { MemberAssignmentResponseDto } from './dto/member-assignment-response.dto';

@ApiTags('프로젝트')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '프로젝트 등록',
    description: '새로운 프로젝트를 생성하고 담당자를 배정합니다.',
  })
  @ApiCreatedResponse({ description: '성공', schema: { example: { status: 201, description: '프로젝트가 성공적으로 등록되었습니다.', data: { id: 1, name: '프로젝트명', status: 'PLANNING' } } } })
  @ApiBadRequestResponse({ description: '잘못된 요청', schema: { example: { status: 400, description: '입력 데이터 유효성 검사에 실패했습니다.', error: 'Bad Request' } } })
  @ApiConflictResponse({ description: '충돌', schema: { example: { status: 409, description: '해당 고객사에 이미 동일한 프로젝트명이 존재합니다.', error: 'Conflict' } } })
  @ApiInternalServerErrorResponse({ description: '서버 오류', schema: { example: { status: 500, description: '프로젝트 등록 중 알 수 없는 서버 오류가 발생했습니다.', error: 'Internal Server Error' } } })
  async register(@Body() dto: RegisterProjectDto) {
    return await this.projectService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: '프로젝트 목록 조회', description: '검색 필터(키워드, 부서, 팀, 상태)와 페이지네이션을 적용하여 프로젝트 목록을 조회합니다.' })
  @ApiQuery({ name: 'keyword', required: false, description: '프로젝트명 또는 고객사명 검색어' })
  @ApiQuery({ name: 'departmentId', required: false, description: '부서(실) ID' })
  @ApiQuery({ name: 'teamId', required: false, description: '팀 ID' })
  @ApiQuery({ name: 'status', required: false, description: '진행 상태 코드 (공통코드)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: '조회 페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: '페이지당 노출 개수' })
  @ApiOkResponse({
    description: '조회 성공',
    schema: {
      example: {
        status: 200,
        description: '목록 조회가 완료되었습니다.',
        data: {
          items: [
            {
              id: 1,
              name: '차세대 보안 관제 시스템 구축',
              displayOrg: '보안솔루션실 / 개발1팀',
              customerName: '우리은행',
              status: 'ONGOING',
              startDate: '2026-01-01',
              endDate: '2026-12-31',
              amount: 500000000,
              memberCount: 5,
              regTime: '2026-01-22T10:17:00Z',
            },
          ],
          meta: {
            total: 120,
            page: 1,
            lastPage: 12,
          },
        },
      },
    },
  })
  async query(@Query() dto: QueryProjectsDto) {
    const result = await this.projectService.query(dto);
    return {
      status: HttpStatus.OK,
      description: '목록 조회가 완료되었습니다.',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 상세 조회', description: '기본정보 탭과 투입인력 탭에 필요한 모든 데이터를 조회합니다.' })
  @ApiOkResponse({
    description: '조회 성공',
    schema: {
      example: {
        status: 200,
        data: {
          basicInfo: {
            name: '차세대 시스템 구축',
            orgText: '공공사업부 > 개발1팀',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            status: '진행중',
            memberCount: 3,
            location: '고객사 상주 (우리은행 본점)',
            customerName: '우리은행',
            amount: 500000000,
            description: '우리은행 차세대 뱅킹 시스템 구축 프로젝트입니다.',
            taskSummary: '백엔드 API 개발 및 대외계 인터페이스 연동',
            customerContacts: [{ name: '김철수 과장', phone: '010-1234-5678', email: 'kim@bank.com' }],
            notes: '보안 서약서 제출 필수',
          },
          members: [{ name: '홍길동', orgText: '솔루션본부 > 개발2팀', role: 'PL', inputStartDate: '2026-01-01' }],
        },
      },
    },
  })
  async get(@Param('id', ParseIntPipe) id: number) {
    const data = await this.projectService.get(id);

    return {
      message: '조회가 완료되었습니다.',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: '프로젝트 정보 수정',
    description: '프로젝트 정보를 수정합니다. 인력 정보(projectAssignment)를 포함하면 기존 데이터를 대체합니다.',
  })
  @ApiResponse({ status: 200, description: '수정 성공' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return await this.projectService.update(id, dto);
  }

  @Get('assign-detail')
  @ApiOperation({
    summary: '프로젝트 투입 인력 상세 조회 (팝업용)',
    description: '특정 프로젝트에 투입된 인력의 상세 정보, 투입 기간, 월별 M/M 현황을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: MemberAssignmentResponseDto,
  })
  async getMemberAssignment(@Query() query: GetMemberAssignmentlDto): Promise<MemberAssignmentResponseDto> {
    return this.projectService.getMemberAssignmentData(query.projectId, query.employeeId);
  }

  @Patch(':projectId/members/:employeeId')
  @ApiOperation({
    summary: '프로젝트 투입 인력 상세 수정 (팝업용)',
    description: '특정 프로젝트에 투입된 인력의 상세 정보, 투입 기간, 월별 M/M 현황을 수정합니다.',
  })
  @ApiParam({ name: 'projectId', description: '프로젝트 ID', example: 1 })
  @ApiParam({ name: 'employeeId', description: '사원 ID', example: 'kd.hong' })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  async updateMemberAssignment(@Param('projectId', ParseIntPipe) projectId: number, @Param('employeeId') employeeId: string, @Body() updateDto: UpdateMemberAssignmentDto) {
    return await this.projectService.updateMemberAssignment(projectId, employeeId, updateDto);
  }
}
