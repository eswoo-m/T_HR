import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { AssetDto } from '@modules/dto/asset.dto';
import { AssetHistoryDto } from '@modules/dto/asset-history.dto';

export class UpdateAssetDto extends PartialType(AssetDto) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AssetHistoryDto)
  assetHistories?: AssetHistoryDto[];
}