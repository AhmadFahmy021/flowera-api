import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),

  username: process.env.DB_USERNAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? '',

  charset: 'utf8mb4',
  // mysql2 mengembalikan DECIMAL sebagai string; kolom RATING memakai `decimal`,
  // jadi tanpa ini tipe nilainya berubah dari number menjadi string di response API.
  extra: { decimalNumbers: true },

  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
  logging: true,
});