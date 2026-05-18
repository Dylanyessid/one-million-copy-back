import { Router } from "express";
import { createLead, getLeads } from "../modules/leads/leads.controller";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { CreateLeadDto } from "../modules/leads/dto/create.dto";
import { GetLeadsDto } from "../modules/leads/dto/get-leads.dto";

const router = Router();

router.get('/', validationMiddleware(GetLeadsDto, 'query'), getLeads);

router.post('/', validationMiddleware(CreateLeadDto), createLead);


export default router;