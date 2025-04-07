import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(
    __dirname,
    `../configs/.env-${process.env.NODE_ENV || 'dev'}`,
  ),
});

const dataSourceOptions: any = {
  type: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '/migrations/**/*.{ts,js}')],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);

export default dataSourceOptions;
