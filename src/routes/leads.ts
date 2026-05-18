import { Router } from "express";
import { createLead, getLeads, updateLead } from "../modules/leads/leads.controller";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { CreateLeadDto } from "../modules/leads/dto/create.dto";
import { GetLeadsDto } from "../modules/leads/dto/get-leads.dto";
import { UpdateLeadDto } from "../modules/leads/dto/update-lead.dto";

const router = Router();

router.get('/', validationMiddleware(GetLeadsDto, 'query'), getLeads);

router.post('/', validationMiddleware(CreateLeadDto), createLead);

router.patch('/:id', validationMiddleware(UpdateLeadDto), updateLead);


export default router;