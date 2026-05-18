import bcrypt from 'bcrypt';
import { envs } from '../../config/envs';


export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(envs.bcrypt.rounds);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};