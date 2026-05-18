import { comparePassword } from '../../libs/bcrypt';
import { jwtService } from '../../libs/jwt';
import AppDataSource from '../../config/database/database';
import { Usuario } from '../../models/Usuario';

export interface LoginResult {
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.hash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwtService.sign({ id: user.id });

    return { token };
  },
};