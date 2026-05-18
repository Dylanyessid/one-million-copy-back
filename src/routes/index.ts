import { Router } from "express";
import AuthRouter from "./auth";
import LeadsRouter from "./leads";

const appRouter = Router();

appRouter.use('/auth', AuthRouter);
appRouter.use('/leads', LeadsRouter);

export default appRouter;