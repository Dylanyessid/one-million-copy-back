import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';

export interface JwtPayload {
  id: string;
}

export const jwtService = {
  sign(payload: JwtPayload): string {
    return jwt.sign(payload, envs.jwt.secret, {
      expiresIn: '1h',
    });
  },

  verify(token: string): JwtPayload {
    return jwt.verify(token, envs.jwt.secret) as JwtPayload;
  },
};