import { File } from 'src/modules/file/interfaces/file.interface';
import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';

export interface Car {
  id: string;
  author: string;
  carManufacturer: CarManufacturer;
  carModel: CarModel;
  year: number;
  vin: string;
  description?: string;
  publishDate: Date;
  images: File[];
}
