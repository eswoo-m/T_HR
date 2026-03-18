// dto/get-assets.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // 또는 @nestjs/swagger
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetDto } from '@modules/dto/asset.dto';

export class GetAssetsDto extends PartialType(AssetDto) {
  @IsOptional()
  @IsString()
  dept?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  assetTypeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamId?: number;

  @IsOptional()
  @IsString()
  sortField?: string = 'registDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
