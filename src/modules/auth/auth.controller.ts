import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './dto/login.dto';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginDto = req.body;

  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};