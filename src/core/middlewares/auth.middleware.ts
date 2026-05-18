import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../libs/jwt';
import { getErrorMessageResponse, ErrorCodes } from '../utils/api-messages';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const errorData = getErrorMessageResponse(ErrorCodes.UNAUTHORIZED);
    res.status(errorData.httpCode).json({
      messageCode: ErrorCodes.UNAUTHORIZED,
      message: 'Token no proporcionado',
      httpCode: errorData.httpCode,
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verify(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    const errorData = getErrorMessageResponse(ErrorCodes.UNAUTHORIZED);
    res.status(errorData.httpCode).json({
      messageCode: ErrorCodes.UNAUTHORIZED,
      message: 'Token inválido o expirado',
      httpCode: errorData.httpCode,
    });
  }
};