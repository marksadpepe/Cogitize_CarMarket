import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CarEntity } from 'src/modules/car/entities/car.entity';
import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';
import { CarService } from 'src/modules/car/car.service';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileService } from 'src/modules/file/file.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/interfaces/user-role.enum';

const mockOwner = {
  id: 'owner-uuid',
  email: 'owner@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'hashed',
  role: UserRole.User,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockImage = {
  id: 'file-uuid',
  title: '123-photo.jpg',
  url: 'http://localhost:9000/carmarket/123-photo.jpg',
  mimeType: 'image/jpeg',
  size: 1024,
  car: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockCar = {
  id: 'car-uuid',
  carManufacturer: CarManufacturer.Toyota,
  carModel: CarModel.Camry,
  year: 2022,
  vin: 'ABCD12345WXYZ6789',
  description: 'A nice car',
  publishDate: new Date('2024-01-01'),
  owner: mockOwner,
  images: [mockImage],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockCarRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockFileRepository = {
  update: jest.fn(),
};

const mockUserRepository = {
  exists: jest.fn(),
};

const mockFileService = {
  uploadFile: jest.fn(),
  deleteFiles: jest.fn(),
};

describe('CarService', () => {
  let service: CarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        { provide: getRepositoryToken(CarEntity), useValue: mockCarRepository },
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockFileRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        { provide: FileService, useValue: mockFileService },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    jest.clearAllMocks();
  });

  describe('createCar', () => {
    const createData = {
      carManufacturer: CarManufacturer.Toyota,
      carModel: CarModel.Camry,
      year: 2022,
      vin: 'ABCD12345WXYZ6789',
      description: 'A nice car',
    };

    it('should create a car and return id with success true', async () => {
      mockUserRepository.exists.mockResolvedValue(true);
      mockCarRepository.create.mockReturnValue(mockCar);
      mockCarRepository.save.mockResolvedValue(mockCar);

      const result = await service.createCar('owner-uuid', createData, []);

      expect(result).toEqual({ id: 'car-uuid', success: true });
      expect(mockCarRepository.save).toHaveBeenCalled();
      expect(mockFileService.uploadFile).not.toHaveBeenCalled();
    });

    it('should upload files and associate them with the car', async () => {
      const mockFile = <Express.Multer.File>{
        originalname: 'photo.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from(''),
        size: 512,
      };

      mockUserRepository.exists.mockResolvedValue(true);
      mockCarRepository.create.mockReturnValue(mockCar);
      mockCarRepository.save.mockResolvedValue(mockCar);
      mockFileService.uploadFile.mockResolvedValue(mockImage);
      mockFileRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.createCar('owner-uuid', createData, [
        mockFile,
      ]);

      expect(result).toEqual({ id: 'car-uuid', success: true });
      expect(mockFileService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(mockFileRepository.update).toHaveBeenCalledWith('file-uuid', {
        car: { id: 'car-uuid' },
      });
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      mockUserRepository.exists.mockResolvedValue(false);

      await expect(
        service.createCar('missing-uuid', createData, []),
      ).rejects.toThrow(NotFoundException);

      expect(mockCarRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getCars', () => {
    it('should return a mapped list of cars', async () => {
      mockCarRepository.find.mockResolvedValue([mockCar]);

      const result = await service.getCars();

      expect(result).toEqual([
        {
          id: 'car-uuid',
          author: 'John Doe',
          carManufacturer: CarManufacturer.Toyota,
          carModel: CarModel.Camry,
          year: 2022,
          publishDate: mockCar.publishDate,
          imageId: mockImage.id,
          description: 'A nice car',
        },
      ]);
    });

    it('should set image to undefined when car has no images', async () => {
      mockCarRepository.find.mockResolvedValue([{ ...mockCar, images: [] }]);

      const [result] = await service.getCars();

      expect(result.imageId).toBeUndefined();
    });

    it('should return empty array when no cars exist', async () => {
      mockCarRepository.find.mockResolvedValue([]);

      const result = await service.getCars();

      expect(result).toEqual([]);
    });
  });

  describe('getCarById', () => {
    it('should return car with full VIN for owner', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);

      const result = await service.getCarById('car-uuid', {
        sub: 'owner-uuid',
        role: UserRole.User,
      });

      expect(result.vin).toBe('ABCD12345WXYZ6789');
    });

    it('should return car with masked VIN for non-owner', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);

      const result = await service.getCarById('car-uuid', {
        sub: 'other-uuid',
        role: UserRole.User,
      });

      expect(result.vin).toBe('ABCD*********6789');
    });

    it('should return car with masked VIN for guest (no user)', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);

      const result = await service.getCarById('car-uuid', undefined);

      expect(result.vin).toBe('ABCD*********6789');
    });

    it('should return images array', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);

      const result = await service.getCarById('car-uuid', {
        sub: 'owner-uuid',
        role: UserRole.User,
      });

      expect(result.images).toHaveLength(1);

      const { images } = result;
      const [image] = images;

      expect(image).toEqual({
        id: 'file-uuid',
        title: '123-photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      });
    });

    it('should throw NotFoundException when car not found', async () => {
      mockCarRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getCarById('missing-uuid', undefined),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCar', () => {
    it('should return success true when owner updates car', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);
      mockCarRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateCar('car-uuid', 'owner-uuid', {
        description: 'Updated',
      });

      expect(result).toEqual({ success: true });
      expect(mockCarRepository.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when non-owner tries to update', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);

      await expect(
        service.updateCar('car-uuid', 'other-uuid', { description: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);

      expect(mockCarRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when car not found', async () => {
      mockCarRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateCar('missing-uuid', 'owner-uuid', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return success false when update affects 0 rows', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);
      mockCarRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.updateCar('car-uuid', 'owner-uuid', {});

      expect(result).toEqual({ success: false });
    });
  });

  describe('deleteCar', () => {
    it('should delete car and its files when owner requests', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);
      mockFileService.deleteFiles.mockResolvedValue(undefined);
      mockCarRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteCar('car-uuid', 'owner-uuid');

      expect(result).toEqual({ success: true });
      expect(mockFileService.deleteFiles).toHaveBeenCalledWith([mockImage]);
      expect(mockCarRepository.softDelete).toHaveBeenCalledWith('car-uuid');
    });

    it('should throw ForbiddenException when non-owner tries to delete', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);

      await expect(service.deleteCar('car-uuid', 'other-uuid')).rejects.toThrow(
        ForbiddenException,
      );

      expect(mockFileService.deleteFiles).not.toHaveBeenCalled();
      expect(mockCarRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when car not found', async () => {
      mockCarRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteCar('missing-uuid', 'owner-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return success false when softDelete affects 0 rows', async () => {
      mockCarRepository.findOne.mockResolvedValue(mockCar);
      mockFileService.deleteFiles.mockResolvedValue(undefined);
      mockCarRepository.softDelete.mockResolvedValue({ affected: 0 });

      const result = await service.deleteCar('car-uuid', 'owner-uuid');

      expect(result).toEqual({ success: false });
    });
  });
});
