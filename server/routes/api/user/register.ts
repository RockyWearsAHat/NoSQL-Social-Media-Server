import { Router, Request, Response } from "express";
import User from "../../../../db/models/user";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({
      success: false,
      message: "Username, email and password are required",
    });
  }

  const foundUser =
    (await User.findOne({ username })) || (await User.findOne({ email }));

  if (foundUser) {
    return res.json({
      success: false,
      message: "User already exists",
    });
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });

  res.json({
    success: true,
    message: "User created",
    user: newUser.toJSON(),
  });
});

export default router;
