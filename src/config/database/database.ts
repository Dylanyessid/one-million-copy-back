import { DataSource } from 'typeorm';
import { envs } from '../envs';

 const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.db.host,
  port: envs.db.port,
  username: envs.db.username,
  password: envs.db.password,
  database: envs.db.database,
  logging: envs.nodeEnv !== 'production',
  entities: [],

});

export default AppDataSource;