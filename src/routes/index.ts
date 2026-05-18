import { Router } from "express";
import AuthRouter from "./auth";
const appRouter = Router();

appRouter.use('/auth', AuthRouter);

export default appRouter;