import { IsBoolean } from 'class-validator';

import { DeleteCar } from 'src/modules/car/interfaces/delete-car.interface';

export class DeleteCarResponseDto implements DeleteCar {
  @IsBoolean()
  success: boolean;
}
