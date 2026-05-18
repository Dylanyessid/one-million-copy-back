import { Router } from "express";
import { createLead } from "../modules/leads/leads.controller";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { CreateLeadDto } from "../modules/leads/dto/create.dto";

const router = Router();

router.post('/', validationMiddleware(CreateLeadDto), createLead);


export default router;