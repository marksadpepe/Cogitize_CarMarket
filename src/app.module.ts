import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config/config';
import { Config } from 'src/config/interfaces/config.interface';
import { DatabaseNamingStrategy } from 'src/db/naming.strategy';
import { FileModule } from 'src/modules/file/file.module';
import { UserModule } from 'src/modules/user/user.module';
import { CarModule } from 'src/modules/car/car.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => ({
        type: 'postgres',
        url: configService.get('database.url', { infer: true }),
        entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
        namingStrategy: new DatabaseNamingStrategy(),
        synchronize: false,
        migrationsRun: configService.get('database.migrationsRun', {
          infer: true,
        }),
        logging: configService.get('database.logging', { infer: true }),
      }),
    }),
    FileModule,
    UserModule,
    CarModule,
  ],
})
export class AppModule {}
