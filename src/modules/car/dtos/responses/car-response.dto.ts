import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { FileDto } from 'src/modules/file/dtos/generic/file.dto';
import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';
import { Car } from 'src/modules/car/interfaces/car.interface';
import { Type } from 'class-transformer';

export class CarResponseDto implements Car {
  @IsUUID('4')
  id: string;

  @IsString()
  author: string;

  @IsEnum(CarManufacturer)
  carManufacturer: CarManufacturer;

  @IsEnum(CarModel)
  carModel: CarModel;

  @IsInt()
  year: number;

  @IsString()
  vin: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  publishDate: Date;

  @IsArray()
  @Type(() => FileDto)
  images: FileDto[];
}
