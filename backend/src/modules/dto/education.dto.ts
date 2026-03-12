import { IsOptional, IsString } from 'class-validator';

export class  Education {
  @IsOptional() @IsString() eduLevel: string;
  @IsOptional() @IsString() lastSchool: string;
  @IsOptional() @IsString() major: string;
  @IsOptional() @IsString() graduationDate: string;
  @IsOptional() @IsString() status: string;
}