import { DataSource } from 'typeorm';
import { envs } from '../envs';
import { Usuario } from '../../models/Usuario';
import { Lead } from '../../models/Lead';


 const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.db.host,
  port: envs.db.port,
  username: envs.db.username,
  password: envs.db.password,
  database: envs.db.database,
  logging: envs.nodeEnv !== 'production',
  entities: [Usuario, Lead],
  ssl: envs.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

export default AppDataSource;