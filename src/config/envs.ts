import dotenv from 'dotenv';

dotenv.config();

export const envs = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  bcrypt:{
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
  openai:{
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'one_million_copy',
  },
};