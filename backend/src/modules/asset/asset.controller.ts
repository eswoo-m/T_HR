import { Controller, Patch, Param, Get, Post, Put, Body, UsePipes, ParseIntPipe, ValidationPipe, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { RegisterAssetDto } from './dto/register-asset.dto';
import { RegisterAssetTypeDto } from './dto/register-assetType.dto';
import { UpdateAssetDto } from '@modules/asset/dto/update-asset.dto';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('types')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAssetType(@Body() dto: RegisterAssetTypeDto) {
    return await this.assetService.createAssetType(dto);
  }

  @Get('types')
  async getAssetTypes() {
    return await this.assetService.getAssetTypes();
  }

  @Patch('types/:id/status')
  async toggleTypeStatus(@Param('id', ParseIntPipe) id: number, @Body('isActive') isActive: boolean) {
    return await this.assetService.toggleTypeStatus(id, isActive);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerAsset(@Body() dto: RegisterAssetDto) {
    return await this.assetService.registerAsset(dto);
  }

  @Get()
  async getAssets(@Query() query: any) {
    return await this.assetService.getAssets(query);
  }

  @Get(':id')
  async getAssetById(@Param('id') id: string) {
    return await this.assetService.getAssetById(Number(id));
  }

  @Put(':id')
  async updateAsset(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetDto) {
    return await this.assetService.updateAssetWithHistory(id, dto);
  }
}
