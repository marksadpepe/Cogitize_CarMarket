import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';
import { CarListItem } from 'src/modules/car/interfaces/car-list-item.interface';

export class CarListItemResponseDto implements CarListItem {
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

  @IsDateString()
  publishDate: Date;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
