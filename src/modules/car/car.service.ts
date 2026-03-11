import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileService } from 'src/modules/file/file.service';
import { CreateCar } from 'src/modules/car/interfaces/create-car.interface';
import { DeleteCar } from 'src/modules/car/interfaces/delete-car.interface';
import { UpdateCar } from 'src/modules/car/interfaces/update-car.interface';
import { Car } from 'src/modules/car/interfaces/car.interface';
import { CarListItem } from 'src/modules/car/interfaces/car-list-item.interface';
import { CreateCarData } from 'src/modules/car/interfaces/payload/create-car-data.interface';
import { UpdateCarData } from 'src/modules/car/interfaces/payload/update-car-data.interface';
import { CarEntity } from 'src/modules/car/entities/car.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
  ) {}

  async createCar(
    ownerId: string,
    data: CreateCarData,
    files: Express.Multer.File[],
  ): Promise<CreateCar> {
    const isExists = await this.userRepository.exists({
      where: {
        id: ownerId,
      },
    });

    if (!isExists) {
      throw new NotFoundException('User not found');
    }

    const { carManufacturer, carModel, year, vin, description } = data;

    const car = await this.carRepository.save(
      this.carRepository.create({
        carManufacturer,
        carModel,
        year,
        vin,
        description,
        publishDate: new Date(),
        owner: {
          id: ownerId,
        },
      }),
    );

    const { id: carId } = car;

    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const newFile = await this.fileService.uploadFile(file);
          const { id: newFileId } = newFile;

          await this.fileRepository.update(newFileId, {
            car: { id: carId },
          });
        }),
      );
    }

    return { id: carId, success: true };
  }

  async getCars(): Promise<CarListItem[]> {
    const cars = await this.carRepository.find({
      relations: {
        owner: true,
        images: true,
      },
    });

    return cars.map((car) => {
      const {
        id,
        carManufacturer,
        carModel,
        year,
        publishDate,
        description,
        owner,
        images,
      } = car;
      const { firstName, lastName } = owner;

      const [image] = images;

      return {
        id,
        author: `${firstName} ${lastName}`,
        carManufacturer,
        carModel,
        year,
        publishDate,
        image: image?.url,
        description,
      };
    });
  }

  async getCarById(id: string, user?: JwtPayload): Promise<Car> {
    const car = await this.carRepository.findOne({
      relations: {
        owner: true,
        images: true,
      },
      where: {
        id,
      },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const {
      carManufacturer,
      carModel,
      year,
      vin,
      description,
      publishDate,
      owner,
      images,
    } = car;
    const { id: ownerId, firstName, lastName } = owner;

    const { sub: userId } = user ?? {};

    const isOwner = userId === ownerId;
    const maskedVin = isOwner ? vin : this.maskVin(vin);

    return {
      id,
      author: `${firstName} ${lastName}`,
      carManufacturer,
      carModel,
      year,
      vin: maskedVin,
      description,
      publishDate,
      images: images.map(({ id: fileId, title, url, mimeType, size }) => ({
        id: fileId,
        title,
        url,
        mimeType,
        size,
      })),
    };
  }

  async updateCar(
    id: string,
    userId: string,
    data: UpdateCarData,
  ): Promise<UpdateCar> {
    const car = await this.carRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
      },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const {
      owner: { id: ownerId },
    } = car;

    if (ownerId !== userId) {
      throw new ForbiddenException();
    }

    const { carManufacturer, carModel, description, vin, year } = data;
    const { affected } = await this.carRepository.update(id, {
      carManufacturer,
      carModel,
      description,
      vin,
      year,
    });

    return { success: Number(affected) > 0 };
  }

  async deleteCar(id: string, userId: string): Promise<DeleteCar> {
    const car = await this.carRepository.findOne({
      relations: {
        owner: true,
        images: true,
      },
      where: {
        id,
      },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const {
      owner: { id: ownerId },
      images,
    } = car;

    if (ownerId !== userId) {
      throw new ForbiddenException();
    }

    await this.fileService.deleteFiles(images);

    const { affected } = await this.carRepository.softDelete(id);

    return { success: Number(affected) > 0 };
  }

  private maskVin(vin: string): string {
    return vin.slice(0, 4) + '*'.repeat(vin.length - 8) + vin.slice(-4);
  }
}
