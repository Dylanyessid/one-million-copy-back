import { Router } from "express";
import { validationMiddleware } from "../core/middlewares/validation.middleware";
import { LoginDto } from "../modules/auth/dto/login.dto";
import { login } from "../modules/auth/auth.controller";

const router = Router();

router.post('/login',  validationMiddleware(LoginDto), login)

export default router;