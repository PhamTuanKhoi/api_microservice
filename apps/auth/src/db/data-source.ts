import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [UserEntity],
  //   FIXME: webpack: false
  migrations: ['dist/apps/auth/db/migrations/*{.js,.ts}'],
};

export const dataSource = new DataSource(dataSourceOptions);
