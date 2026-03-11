import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';
import { UpdateCarData } from 'src/modules/car/interfaces/payload/update-car-data.interface';

export class UpdateCarRequestDto implements UpdateCarData {
  @IsOptional()
  @IsEnum(CarManufacturer)
  carManufacturer?: CarManufacturer;

  @IsOptional()
  @IsEnum(CarModel)
  carModel?: CarModel;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2030)
  year?: number;

  @IsOptional()
  @IsString()
  @Length(17, 17)
  vin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  description?: string;
}
