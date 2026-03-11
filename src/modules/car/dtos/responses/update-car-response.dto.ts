import { IsBoolean } from 'class-validator';

import { UpdateCar } from 'src/modules/car/interfaces/update-car.interface';

export class UpdateCarResponseDto implements UpdateCar {
  @IsBoolean()
  success: boolean;
}
