import { Type } from 'class-transformer';
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
import { CreateCarData } from 'src/modules/car/interfaces/payload/create-car-data.interface';

export class CreateCarRequestDto implements CreateCarData {
  @IsEnum(CarManufacturer)
  carManufacturer: CarManufacturer;

  @IsEnum(CarModel)
  carModel: CarModel;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2030)
  year: number;

  @IsString()
  @Length(17, 17)
  vin: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  description?: string;
}
