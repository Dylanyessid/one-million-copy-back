import { getSuccessMessageResponse, getErrorMessageResponse, SuccessCodes } from './../../core/utils/api-messages';
import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { apiResponse } from '../../core/utils/api-response';
import {  } from '../../core/utils/api-messages';

export const login = async (req: Request, res: Response) => {
  const { email, password }: LoginDto = req.body;

  const loginResult = await authService.login(email, password);

  if(!loginResult.ok){
    const errorData = getErrorMessageResponse(loginResult.error);
    const response = {
      messageCode: loginResult.error,
      message: errorData.message,
      httpCode: errorData.httpCode
    }
    return res.status(errorData.httpCode).json(response);
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LOGIN_SUCCESS);
  const response = {
      messageCode: SuccessCodes.LOGIN_SUCCESS,
      message: successResponseData.message,
      httpCode: successResponseData.httpCode,
      data: { token: loginResult.value.token }
  }
  return res.status(successResponseData.httpCode).json(response);
  
};