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
  ValidateNested,
} from 'class-validator';

import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';
import { UpdateCarData } from 'src/modules/car/interfaces/payload/update-car-data.interface';
import { UpdateCarPayload } from 'src/modules/car/interfaces/payload/update-car-payload.interface';

class UpdateCarDataDto implements UpdateCarData {
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

export class UpdateCarRequestDto implements UpdateCarPayload {
  @ValidateNested()
  @Type(() => UpdateCarDataDto)
  data: UpdateCarDataDto;
}
