import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from 'nestjs-minio-client';
import { Repository } from 'typeorm';

import { Config } from 'src/config/interfaces/config.interface';
import { FileEntity } from 'src/modules/file/entities/file.entity';

@Injectable()
export class FileService {
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly minioService: MinioService,
    configService: ConfigService<Config, true>,
  ) {
    const endpoint = configService.get('filestorage.minio.endpoint', {
      infer: true,
    });

    this.bucket = configService.get('filestorage.minio.bucket', {
      infer: true,
    });

    this.baseUrl = `${endpoint}/${this.bucket}`;
  }

  async deleteFiles(files: FileEntity[]): Promise<void> {
    await Promise.all(
      files.map(async (file) => {
        const { title } = file;

        await this.minioService.client.removeObject(this.bucket, title);
      }),
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const { originalname, mimetype, buffer, size } = file;

    const title = `${Date.now()}-${originalname}`;

    await this.minioService.client.putObject(this.bucket, title, buffer, size, {
      'Content-Type': mimetype,
    });

    return await this.fileRepository.save(
      this.fileRepository.create({
        title,
        url: `${this.baseUrl}/${title}`,
        mimeType: mimetype,
        size,
      }),
    );
  }
}
