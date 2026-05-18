import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export const validationMiddleware = (
  dtoClass: new () => unknown,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoInstance = plainToInstance(dtoClass, req[property]);
    const errors = await validate(dtoInstance as object);

    if (errors.length > 0) {
      const messages = errors.map((err) => {
        return Object.values(err.constraints || {}).join(', ');
      });
      res.status(400).json({ message: messages.join('; ') });
      return;
    }

    (req as any)[property] = dtoInstance;
    next();
  };
};