import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { DatabaseNamingStrategy } from 'src/db/naming.strategy';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  namingStrategy: new DatabaseNamingStrategy(),
  synchronize: false,
});
