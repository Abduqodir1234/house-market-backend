import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateHouseDto {
  @IsNotEmpty()
  @IsNumberString()
  price: string;
  @IsNotEmpty()
  @IsLongitude()
  longitude: string;
  @IsNotEmpty()
  @IsLatitude()
  latitude: string;
  @IsNotEmpty()
  @IsString()
  address: string;
  @IsNotEmpty()
  @IsNumberString()
  area: string;
}
