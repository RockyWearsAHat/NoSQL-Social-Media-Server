import { Router, Request, Response } from "express";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Error logging out" });
    }
    res.json({ success: true, message: "Logged out" });
  });
});

export default router;
