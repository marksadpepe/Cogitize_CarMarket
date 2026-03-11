import { IsBoolean, IsUUID } from 'class-validator';

import { CreateCar } from 'src/modules/car/interfaces/create-car.interface';

export class CreateCarResponseDto implements CreateCar {
  @IsUUID('4')
  id: string;

  @IsBoolean()
  success: boolean;
}
