import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberResponseDto } from './dto/member-response.dto';

@ApiTags('Common - 기초 데이터 (조직/코드)')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // --- 조직(Organization) 관련 로직 ---

  @Get('/organizations/chart') // 💡 직관적인 경로 변경
  @ApiOperation({ summary: '조직 계층 구조 조회', description: '셀렉트박스 및 단순 조직도용' })
  async getOrgChart() {
    return this.commonService.getOrganizationChart(false);
  }

  @Get('/organizations/chart-with-members')
  @ApiOperation({ summary: '구성원 포함 전체 조직도 조회' })
  async getFullOrgChart() {
    return this.commonService.getOrganizationChart(true);
  }

  @Get('/organizations/:id/sub-structure') // 💡 teams 대신 id를 사용하여 범용성 확보
  @ApiOperation({ summary: '특정 조직의 하위 조직 및 인원 조회' })
  async getOrganizationStructure(@Param('id', ParseIntPipe) id: number) {
    return this.commonService.getOrganizationStructure(id);
  }

  // 1. 최상위 조직(부서) 목록 조회 (첫 번째 셀렉트박스용)
  @Get('/organizations/roots') // 💡 명칭 변경: departments -> organizations/roots
  @ApiOperation({ summary: '최상위 부서 목록 조회' })
  async getRootOrganizations() {
    return this.commonService.getRootOrganizations();
  }

  // 2. 특정 조직의 하위 조직 목록 조회 (두 번째 셀렉트박스 연동용)
  @Get('/organizations/:parentId/children') // 💡 명칭 변경: 부서별 팀 -> 부모별 자식
  @ApiOperation({ summary: '상위 조직별 하위 조직(팀) 목록 조회' })
  async getSubOrganizations(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.commonService.getSubOrganizations(parentId);
  }

  // --- 공통 코드 관련 로직 ---
  @Get('codes')
  @ApiOperation({ summary: '여러 타입의 공통 코드 동시 조회', description: 'query string으로 types=TYPE1,TYPE2 전달' })
  async getMultipleCodes(@Query('types') types: string) {
    const typeArray = types ? types.split(',') : [];
    return await this.commonService.getCodesByTypes(typeArray);
  }

  @Get('code/:type')
  @ApiOperation({ summary: '특정 타입의 공통 코드 목록 조회' })
  async getCodes(@Param('type') type: string) {
    return await this.commonService.getCodesByType(type);
  }

  @Get('/organizations/teams/:teamId/members')
  @ApiOperation({ summary: '팀별 구성원 조회' })
  @ApiResponse({ status: 200, type: [MemberResponseDto] })
  async getTeamMembers(@Param('teamId', ParseIntPipe) teamId: number): Promise<MemberResponseDto[]> {
    return this.commonService.findMembersByTeam(teamId);
  }
}
