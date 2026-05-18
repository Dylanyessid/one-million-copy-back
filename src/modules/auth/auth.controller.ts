import { getSuccessMessageResponse, getErrorMessageResponse, SuccessCodes, ErrorCodes } from './../../core/utils/api-messages';
import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './dto/login.dto';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginDto = req.body;

    const loginResult = await authService.login(email, password);

    if (!loginResult.ok) {
      const errorData = getErrorMessageResponse(loginResult.error);
      return res.status(errorData.httpCode).json({
        messageCode: loginResult.error,
        message: errorData.message,
        httpCode: errorData.httpCode,
      });
    }

    const successResponseData = getSuccessMessageResponse(SuccessCodes.LOGIN_SUCCESS);
    return res.status(successResponseData.httpCode).json({
      messageCode: SuccessCodes.LOGIN_SUCCESS,
      message: successResponseData.message,
      httpCode: successResponseData.httpCode,
      data: { token: loginResult.value.token },
    });
  } catch (error) {
    const errorData = getErrorMessageResponse(ErrorCodes.INTERNAL_ERROR);
    return res.status(errorData.httpCode).json({
      messageCode: ErrorCodes.INTERNAL_ERROR,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }
};