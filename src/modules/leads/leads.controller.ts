import { Request, Response } from 'express';
import { leadService } from './lead.service';
import { CreateLeadDto } from './dto/create.dto';
import { GetLeadsDto } from './dto/get-leads.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
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

export const getLeads = async (req: Request, res: Response) => {
  const params: GetLeadsDto = req.query as any;

  const result = await leadService.findAll({
    cursor: params.cursor,
    limit: params.limit || 10,
    fuente: params.fuente,
    fechaDesde: params.fechaDesde,
    fechaHasta: params.fechaHasta,
  });

  if (!result.ok) {
    const errorData = getErrorMessageResponse(result.error);
    return res.status(errorData.httpCode).json({
      messageCode: result.error,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEADS_FETCHED);
  return res.status(successResponseData.httpCode).json({
    messageCode: successResponseData.messageCode,
    message: successResponseData.message,
    httpCode: successResponseData.httpCode,
    data: {
      leads: result.value.leads,
      nextCursor: result.value.nextCursor,
    },
  });
};

export const updateLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateLeadDto = req.body;

  const result = await leadService.updateLead(id, data);

  if (!result.ok) {
    const errorData = getErrorMessageResponse(result.error);
    return res.status(errorData.httpCode).json({
      messageCode: result.error,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEAD_UPDATED);
  return res.status(successResponseData.httpCode).json({
    messageCode: successResponseData.messageCode,
    message: successResponseData.message,
    httpCode: successResponseData.httpCode,
    data: { lead: result.value },
  });
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await leadService.deleteLead(id);

  if (!result.ok) {
    const errorData = getErrorMessageResponse(result.error);
    return res.status(errorData.httpCode).json({
      messageCode: result.error,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEAD_DELETED);
  return res.status(successResponseData.httpCode).json({
    messageCode: successResponseData.messageCode,
    message: successResponseData.message,
    httpCode: successResponseData.httpCode,
  });
};

export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await leadService.findById(id);

  if (!result.ok) {
    const errorData = getErrorMessageResponse(result.error);
    return res.status(errorData.httpCode).json({
      messageCode: result.error,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEAD_FETCHED);
  return res.status(successResponseData.httpCode).json({
    messageCode: successResponseData.messageCode,
    message: successResponseData.message,
    httpCode: successResponseData.httpCode,
    data: { lead: result.value },
  });
};

export const getLeadStats = async (req: Request, res: Response) => {
  const result = await leadService.getStats();

  if (!result.ok) {
    const errorData = getErrorMessageResponse(result.error);
    return res.status(errorData.httpCode).json({
      messageCode: result.error,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEAD_STATS_FETCHED);
  return res.status(successResponseData.httpCode).json({
    messageCode: successResponseData.messageCode,
    message: successResponseData.message,
    httpCode: successResponseData.httpCode,
    data: result.value,
  });
};

export const getRecommendations = async (req: Request, res: Response) => {
  const params: GetRecommendationsDto = req.query as any;

  const result = await leadService.getRecommendations({
    fuente: params.fuente,
    fechaDesde: params.fechaDesde,
    fechaHasta: params.fechaHasta,
  });

  if (!result.ok) {
    const errorData = getErrorMessageResponse(result.error);
    return res.status(errorData.httpCode).json({
      messageCode: result.error,
      message: errorData.message,
      httpCode: errorData.httpCode,
    });
  }

  const successResponseData = getSuccessMessageResponse(SuccessCodes.LEAD_RECOMMENDATIONS_FETCHED);
  return res.status(successResponseData.httpCode).json({
    messageCode: successResponseData.messageCode,
    message: successResponseData.message,
    httpCode: successResponseData.httpCode,
    data: { recomendaciones: result.value },
  });
};