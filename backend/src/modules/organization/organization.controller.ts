import { Controller, Get, Post, Param, Body, Patch, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { OrganizationDetailResponseDto } from '@modules/organization/dto/organization-detail-response.dto';
import { RegisterOrganizationDto } from '@modules/organization/dto/register-organization.dto';
import { UpdateOrganizationDto } from '@modules/organization/dto/update-organization.dto';
import { OrganizationChangeDto } from '@modules/organization/dto/delete-organization.dto';
import { GetOrganizationHistoryDto } from '@modules/organization/dto/get-organization-history.dto';
@ApiTags('조직 관리')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: '신규 조직 등록', description: '새로운 부서나 팀을 등록합니다.' })
  @ApiResponse({ status: 201, description: '등록 성공' })
  @ApiResponse({ status: 404, description: '상위 조직 ID가 유효하지 않음' })
  async register(@Body() dto: RegisterOrganizationDto) {
    return this.orgService.registerOrganization(dto);
  }

  @Get(':id/detail')
  @ApiOperation({
    summary: '조직 상세 정보 조회',
    description: '특정 조직의 상세 정보, 진행 프로젝트, 하위 조직 및 구성원 리스트를 반환합니다.',
  })
  @ApiParam({ name: 'id', description: '조직 ID', example: 1 })
  @ApiResponse({ status: 200, description: '조회 성공', type: OrganizationDetailResponseDto })
  @ApiResponse({ status: 404, description: '존재하지 않는 조직 ID입니다.' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.getOrganizationDetail(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '조직 정보 수정',
    description: '조직의 상세 설명(desc)만 수정할 수 있습니다.',
  })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '조직을 찾을 수 없음' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrganizationDto) {
    return this.orgService.updateOrganization(id, dto);
  }

  @Post(':id/change')
  @ApiOperation({ summary: '부서 변경 및 삭제(종료) 처리', description: '부서명(name)이 있으면 기존 부서를 종료하고 신규 부서를 생성하며, 없으면 부서를 종료 처리하고 구성원을 상위로 이동시킵니다.' })
  @ApiParam({ name: 'id', description: '변경/삭제할 부서의 ID', example: 1 })
  @ApiResponse({ status: 201, description: '처리가 성공적으로 완료되었습니다.', schema: { example: { message: '부서명 변경 완료', newId: 10 } } })
  @ApiResponse({ status: 400, description: '날짜 형식이 잘못되었거나 필수 파라미터가 누락되었습니다.' })
  @ApiResponse({ status: 404, description: '해당 ID를 가진 부서를 찾을 수 없습니다.' })
  @ApiResponse({ status: 500, description: '서버 내부 처리 중 오류가 발생했습니다.' })
  async changeOrganization(@Param('id', ParseIntPipe) id: number, @Body() dto: OrganizationChangeDto) {
    return await this.orgService.handleOrganizationChange(id, dto);
  }

  @Get('history')
  @ApiOperation({ summary: '조직 변경 이력 조회' })
  async getHistory(@Query() dto: GetOrganizationHistoryDto) {
    return await this.orgService.getOrganizationHistory(dto);
  }
}
