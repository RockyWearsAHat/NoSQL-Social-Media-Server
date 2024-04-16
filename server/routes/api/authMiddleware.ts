import { Router, Request, Response, NextFunction } from "express";

const router: Router = Router();

// Middleware for authorization
export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user)
    return res.json({ success: false, message: "User not logged in" });
  else next();
};

export default router;
