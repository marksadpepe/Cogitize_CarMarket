import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DeleteUser } from 'src/modules/user/interfaces/delete-user.interface';
import { UpdateUserPayload } from 'src/modules/user/interfaces/payload/update-user-payload.interface';
import { UpdateUser } from 'src/modules/user/interfaces/update-user.interface';
import { User } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { id: userId, email, firstName, lastName } = user;

    return { id: userId, email, firstName, lastName };
  }

  async updateUser(
    id: string,
    payload: UpdateUserPayload,
  ): Promise<UpdateUser> {
    const exists = await this.userRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const { data } = payload;

    const { affected } = await this.userRepository.update(id, data);

    return { success: Number(affected) > 0 };
  }

  async deleteUser(id: string): Promise<DeleteUser> {
    const exists = await this.userRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const { affected } = await this.userRepository.softDelete(id);

    return { success: Number(affected) > 0 };
  }
}
