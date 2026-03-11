import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';

import { Config } from 'src/config/interfaces/config.interface';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileService } from 'src/modules/file/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => {
        const endpoint = configService.get('filestorage.minio.endpoint', {
          infer: true,
        });

        return {
          endPoint: new URL(endpoint).hostname,
          port: configService.get('filestorage.minio.port', { infer: true }),
          useSSL: configService.get('filestorage.minio.useSSL', {
            infer: true,
          }),
          accessKey: configService.get('filestorage.minio.rootUser', {
            infer: true,
          }),
          secretKey: configService.get('filestorage.minio.rootPassword', {
            infer: true,
          }),
        };
      },
    }),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
