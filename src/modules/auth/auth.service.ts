import { comparePassword } from '../../libs/bcrypt';
import { jwtService } from '../../libs/jwt';
import AppDataSource from '../../config/database/database';
import { Result, ok, err } from '../../core/utils/result';
import { Usuario } from '../../models/Usuario';

export interface LoginData {
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<Result<LoginData, string>> {
    try {
      const userRepository = AppDataSource.getRepository(Usuario);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return err('USER_NOT_FOUND');
      }

      const isPasswordValid = await comparePassword(password, user.hash);

      if (!isPasswordValid) {
        return err('INVALID_CREDENTIALS');
      }

      const token = jwtService.sign({ id: user.id});

      return ok({ token });
    } catch (error) {
      return err('INTERNAL_ERROR');
    }
  },
};