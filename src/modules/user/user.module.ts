import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/modules/auth/auth.module';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
