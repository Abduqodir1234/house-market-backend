import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class HouseListDto {
  @IsOptional()
  @IsNumberString()
  price_gt?: string;
  @IsOptional()
  @IsNumberString()
  price_lt?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsNumberString()
  area_gt?: number;
  @IsOptional()
  @IsNumberString()
  area_lt?: number;
  @IsOptional()
  @IsNumberString()
  offset?: string;
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
