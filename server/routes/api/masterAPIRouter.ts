import { Router } from "express";
import { masterUserRouter } from "./user/masterUserRouter";

export const apiRouter: Router = Router();

apiRouter.use("/user", masterUserRouter);
