import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Patch } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberResponseDto } from './dto/member-response.dto';
// 👇 [추가] 검증용 데코레이터 임포트
import { IsString, IsOptional } from 'class-validator';

// --- DTO 정의 ---

class CreateCodeDto {
  @IsString()
  type: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class UpdateCodeDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// [수정됨] 데코레이터(@IsString 등)를 붙여야 데이터가 살아남습니다!
export class CreateCategoryDto {
  @IsString()
  categoryCode: string; // 예: TECH

  @IsString()
  firstCode: string;    // 예: JAVA

  @IsString()
  firstName: string;    // 예: Java

  @IsOptional()
  @IsString()
  firstDesc?: string;   // 예: 백엔드 언어
}

@ApiTags('Common - 기초 데이터 (조직/코드)')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // ... (이하 기존 코드와 100% 동일, 변경 없음) ...
  
  // ===========================================================================
  // [Section 1] 기존 기능: 조직(Organization) API
  // ===========================================================================

  @Get('/organizations/chart')
  @ApiOperation({ summary: '조직 계층 구조 조회', description: '셀렉트박스 및 단순 조직도용' })
  async getOrgChart() {
    return this.commonService.getOrganizationChart(false);
  }

  @Get('/organizations/chart-with-members')
  @ApiOperation({ summary: '구성원 포함 전체 조직도 조회' })
  async getFullOrgChart() {
    return this.commonService.getOrganizationChart(true);
  }

  @Get('/organizations/:id/sub-structure')
  @ApiOperation({ summary: '특정 조직의 하위 조직 및 인원 조회' })
  async getOrganizationStructure(@Param('id', ParseIntPipe) id: number) {
    return this.commonService.getOrganizationStructure(id);
  }

  @Get('/organizations/roots')
  @ApiOperation({ summary: '최상위 부서 목록 조회' })
  async getRootOrganizations() {
    return this.commonService.getRootOrganizations();
  }

  @Get('/organizations/:parentId/children')
  @ApiOperation({ summary: '상위 조직별 하위 조직(팀) 목록 조회' })
  async getSubOrganizations(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.commonService.getSubOrganizations(parentId);
  }

  @Get('/organizations/teams/:teamId/members')
  @ApiOperation({ summary: '팀별 구성원 조회' })
  @ApiResponse({ status: 200, type: [MemberResponseDto] })
  async getTeamMembers(@Param('teamId', ParseIntPipe) teamId: number): Promise<MemberResponseDto[]> {
    return this.commonService.findMembersByTeam(teamId);
  }

  // ===========================================================================
  // [Section 2] 공통 코드 API
  // ===========================================================================

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

  @Get('categories')
  @ApiOperation({ summary: '코드 유형(카테고리) 목록 조회' })
  async getCodeCategories() {
    return this.commonService.getCodeCategories();
  }

  @Post('code')
  @ApiOperation({ summary: '공통 코드 추가' })
  async createCode(@Body() dto: CreateCodeDto) {
    return this.commonService.createCode(dto);
  }

  @Put('code/:id')
  @ApiOperation({ summary: '공통 코드 수정' })
  async updateCode(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCodeDto) {
    return this.commonService.updateCode(id, dto);
  }

  @Patch('code/:id/status')
  @ApiOperation({ summary: '공통 코드 활성/비활성 토글' })
  async toggleCodeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.commonService.toggleCodeStatus(id);
  }

  @Post('categories')
  @ApiOperation({ summary: '코드 유형 및 첫 번째 코드 추가' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.commonService.createCategory(dto);
  }
}