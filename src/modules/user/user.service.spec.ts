import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/interfaces/user-role.enum';
import { UserService } from 'src/modules/user/user.service';

const mockUser = {
  id: 'user-uuid',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'hashed',
  role: UserRole.User,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockUserRepository = {
  findOne: jest.fn(),
  exists: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById('user-uuid');

      expect(result).toEqual({
        id: 'user-uuid',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserById('missing-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should return success true when user updated', async () => {
      mockUserRepository.exists.mockResolvedValue(true);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateUser('user-uuid', {
        firstName: 'Jane',
      });

      expect(result).toEqual({ success: true });
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-uuid', {
        firstName: 'Jane',
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.exists.mockResolvedValue(false);

      await expect(
        service.updateUser('missing-uuid', { firstName: 'Jane' }),
      ).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should return success false when update affects 0 rows', async () => {
      mockUserRepository.exists.mockResolvedValue(true);
      mockUserRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.updateUser('user-uuid', {
        firstName: 'Jane',
      });

      expect(result).toEqual({ success: false });
    });
  });

  describe('deleteUser', () => {
    it('should return success true when user deleted', async () => {
      mockUserRepository.exists.mockResolvedValue(true);
      mockUserRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteUser('user-uuid');

      expect(result).toEqual({ success: true });
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith('user-uuid');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.exists.mockResolvedValue(false);

      await expect(service.deleteUser('missing-uuid')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should return success false when softDelete affects 0 rows', async () => {
      mockUserRepository.exists.mockResolvedValue(true);
      mockUserRepository.softDelete.mockResolvedValue({ affected: 0 });

      const result = await service.deleteUser('user-uuid');

      expect(result).toEqual({ success: false });
    });
  });
});
