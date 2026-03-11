import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';

export interface CarListItem {
  id: string;
  author: string;
  carManufacturer: CarManufacturer;
  carModel: CarModel;
  year: number;
  publishDate: Date;
  imageId?: string;
  description?: string;
}
