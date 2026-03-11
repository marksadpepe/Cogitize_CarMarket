import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileEntity } from 'src/modules/file/entities/file.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CarManufacturer } from 'src/modules/car/interfaces/car-manufacturer.enum';
import { CarModel } from 'src/modules/car/interfaces/car-model.enum';

@Entity()
export class CarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CarManufacturer })
  carManufacturer: CarManufacturer;

  @Column({ type: 'enum', enum: CarModel })
  carModel: CarModel;

  @Column()
  year: number;

  @Column()
  vin: string;

  @Column({ type: 'text', nullable: true, default: null })
  description?: string;

  @Column({ type: 'timestamptz' })
  publishDate: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  owner: UserEntity;

  @OneToMany(() => FileEntity, (file) => file.car)
  images: FileEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
