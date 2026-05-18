import { Router } from "express";
import { createLead, getLeads, getLeadById, getLeadStats, getRecommendations, updateLead, deleteLead } from "../modules/leads/leads.controller";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { authMiddleware } from "../core/middlewares/auth.middleware";
import { CreateLeadDto } from "../modules/leads/dto/create.dto";
import { GetLeadsDto } from "../modules/leads/dto/get-leads.dto";
import { UpdateLeadDto } from "../modules/leads/dto/update-lead.dto";
import { GetRecommendationsDto } from "../modules/leads/dto/get-recommendations.dto";

const router = Router();

router.use(authMiddleware);

router.get('/stats', getLeadStats);

router.get('/recommendations', validationMiddleware(GetRecommendationsDto, 'query'), getRecommendations);

router.get('/', validationMiddleware(GetLeadsDto, 'query'), getLeads);

router.get('/:id', getLeadById);

router.post('/', validationMiddleware(CreateLeadDto), createLead);

router.patch('/:id', validationMiddleware(UpdateLeadDto), updateLead);

router.delete('/:id', deleteLead);


export default router;