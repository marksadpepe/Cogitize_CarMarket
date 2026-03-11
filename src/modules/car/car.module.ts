import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/modules/auth/auth.module';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileModule } from 'src/modules/file/file.module';
import { CarEntity } from 'src/modules/car/entities/car.entity';
import { CarController } from 'src/modules/car/car.controller';
import { CarService } from 'src/modules/car/car.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarEntity, FileEntity, UserEntity]),
    AuthModule,
    FileModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
