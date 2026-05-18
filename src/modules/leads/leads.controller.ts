import { Request, Response } from 'express';
import { leadService } from './lead.service';
import { CreateLeadDto } from './dto/create.dto';
import { apiResponse } from '../../core/utils/api-response';
import { getErrorMessageResponse, getSuccessMessageResponse, SuccessCodes } from '../../core/utils/api-messages';

export const createLead = async (req: Request, res: Response) => {
  const data: CreateLeadDto = req.body;

  const createLeadResult = await leadService.createLead(data);

  if(!createLeadResult.ok){
    const errorData = getErrorMessageResponse(createLeadResult.error);
    const responsePayload = {
      messageCode: createLeadResult.error,
      message: errorData.message,
      httpCode: errorData.httpCode
    }
    return res.status(errorData.httpCode).json(responsePayload);
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEAD_CREATED);
  const responsePayload = {
      messageCode: successResponseData.messageCode,
      message: successResponseData.message,
      httpCode: successResponseData.httpCode,
      data: { lead: createLeadResult.value }
  }
  return res.status(responsePayload.httpCode).json(responsePayload);

};