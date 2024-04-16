import { Router } from "express";
import loginRouter from "./login";
import registerRouter from "./register";
import logoutRouter from "./logout";
import friendRouter from "./friends";
import userRouter from "./users";
import thoughtRouter from "./thoughts";

export const masterUserRouter: Router = Router();

masterUserRouter.use("/login", loginRouter);
masterUserRouter.use("/register", registerRouter);
masterUserRouter.use("/logout", logoutRouter);
masterUserRouter.use("/friends", friendRouter);
masterUserRouter.use("/users", userRouter);
masterUserRouter.use("/thoughts", thoughtRouter);
