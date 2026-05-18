import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import AppDataSource from './config/database/database';
import { envs } from './config/envs';
import appRouter from './routes';

const app = express();
const PORT = envs.port;

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1', appRouter);

app.get('/health', (req, res) => {
  res.json({ message: 'Server running' });
});



AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

export default app;