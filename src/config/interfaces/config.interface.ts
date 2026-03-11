export interface Config {
  app: {
    port: number;
  };
  database: {
    url: string;
    migrationsRun: boolean;
    logging: boolean;
  };
  jwt: {
    accessSecret: string;
    accessExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  filestorage: {
    minio: {
      endpoint: string;
      port: number;
      useSSL: boolean;
      rootUser: string;
      rootPassword: string;
      bucket: string;
    };
  };
}
