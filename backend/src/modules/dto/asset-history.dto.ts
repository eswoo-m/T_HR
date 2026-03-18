import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AssetHistoryDto {
  @IsString()
  category: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  actorName?: string;

  @IsString()
  regTime: string;
}
