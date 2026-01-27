import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Common - 기초 데이터 (조직/코드)')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // --- 조직 관련 로직 ---
  @Get('/organizations')
  @ApiOperation({ summary: '부서/팀 계층 구조 조회', description: '셀렉트박스 및 단순 조직도용' })
  async getOrgChart() {
    return this.commonService.getOrganizationChart(false);
  }

  @Get('/organizations/chart-with-members')
  @ApiOperation({ summary: '구성원 포함 전체 조직도 조회' })
  async getFullOrgChart() {
    return this.commonService.getOrganizationChart(true);
  }

  @Get('/organizations/teams/:id/structure')
  @ApiOperation({ summary: '특정 팀의 하위 조직 및 인원 조회' })
  async getTeamStructure(@Param('id', ParseIntPipe) id: number) {
    return this.commonService.getTeamStructure(id);
  }

  // 1. 부서 전체 목록 조회 (첫 번째 셀렉트박스용)
  @Get('departments')
  @ApiOperation({ summary: '부서 전체 목록 조회' })
  async getDepartments() {
    return this.commonService.getDepartments();
  }

  // 2. 특정 부서에 속한 팀 목록 조회 (두 번째 셀렉트박스 연동용)
  @Get('departments/:deptId/teams')
  @ApiOperation({ summary: '부서별 팀 목록 조회' })
  async getTeams(@Param('deptId', ParseIntPipe) deptId: number) {
    return this.commonService.getTeamsByDept(deptId);
  }

  // --- 공통 코드 관련 로직 ---
  @Get('code')
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
}
