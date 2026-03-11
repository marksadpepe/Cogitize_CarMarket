import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';

export interface UpdateCarData {
  carManufacturer?: CarManufacturer;
  carModel?: CarModel;
  year?: number;
  vin?: string;
  description?: string;
}
