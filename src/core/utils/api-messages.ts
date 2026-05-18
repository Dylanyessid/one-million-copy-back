import { ApiResponse } from './api-response';


export enum ErrorCodes {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export enum SuccessCodes {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
}


export const errorMessages: Record<string, { message: string; httpCode: number }> = {
  [ErrorCodes.USER_NOT_FOUND]: { message: 'Usuario no encontrado', httpCode: 404 },
  [ErrorCodes.INVALID_PAYLOAD]: { message: 'Payload inválido', httpCode: 400 },
  [ErrorCodes.INVALID_CREDENTIALS]: { message: 'Credenciales inválidas', httpCode: 401 },
  [ErrorCodes.UNAUTHORIZED]: { message: 'No autorizado', httpCode: 401 },
  [ErrorCodes.BAD_REQUEST]: { message: 'Solicitud inválida', httpCode: 400 },
  [ErrorCodes.INTERNAL_ERROR]: { message: 'Error interno', httpCode: 500 },
} as const;

export const successMessages: Record<string, { message: string; httpCode: number }> = {
  [SuccessCodes.LOGIN_SUCCESS]: { message: 'Login exitoso', httpCode: 200 },
} as const;

export type ErrorCode = keyof typeof errorMessages;
export type SuccessCode = keyof typeof successMessages;

export const getErrorMessageResponse = (code: string): ApiResponse => {
  const error = errorMessages[code] || { message: 'Error desconocido', httpCode: 500 };
  return { messageCode: code, message: error.message, httpCode: error.httpCode };
};

export const getSuccessMessageResponse = (code: string): ApiResponse => {
  const error = successMessages[code] || { message: 'Ok', httpCode: 200 };
  return { messageCode: code, message: error.message, httpCode: error.httpCode };
};