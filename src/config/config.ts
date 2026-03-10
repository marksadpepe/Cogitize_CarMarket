import { Config } from 'src/config/interfaces/config.interface';
import { parseBoolean, parseNumber, parseString } from 'src/config/utils';

export const config = (): Config => ({
  app: {
    port: parseNumber(process.env.PORT, 3000),
  },
  database: {
    url: parseString(process.env.DATABASE_URL),
    migrationsRun: parseBoolean(process.env.DATABASE_MIGRATIONS_RUN),
    logging: parseBoolean(process.env.DATABASE_LOGGING),
  },
  jwt: {
    accessSecret: parseString(process.env.JWT_ACCESS_SECRET),
    accessExpiresIn: parseString(process.env.JWT_ACCESS_EXPIRES_IN, '15m'),
    refreshSecret: parseString(process.env.JWT_REFRESH_SECRET),
    refreshExpiresIn: parseString(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  },
  filestorage: {
    minio: {
      endpoint: parseString(process.env.MINIO_ENDPOINT, 'localhost'),
      port: parseNumber(process.env.MINIO_PORT, 9000),
      useSSL: parseBoolean(process.env.MINIO_USE_SSL),
      rootUser: parseString(process.env.MINIO_ROOT_USER),
      rootPassword: parseString(process.env.MINIO_ROOT_PASSWORD),
      bucket: parseString(process.env.MINIO_BUCKET, 'carmarket'),
    },
  },
});
