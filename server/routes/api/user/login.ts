import { Router, Request, Response } from "express";
import User from "../../../../db/models/user";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  let searchClause = {};

  if ((!username && !email) || !password)
    return res.json({
      success: false,
      message: "Username/email and password required",
    });

  if (email && email.indexOf("@") != -1) {
    searchClause = { email: email };
  } else if (email && email.indexOf("@") == -1) {
    searchClause = { username: email };
  } else {
    username && username.indexOf("@") != -1
      ? (searchClause = { email: username })
      : (searchClause = { username: username });
  }

  const foundUser = await User.findOne(searchClause);

  if (!foundUser) {
    return res.json({
      success: false,
      message: `User not found with ${Object.keys(searchClause)[0]} ${
        Object.values(searchClause)[0]
      }`, //Username can be email or username
    });
  }

  if ((await foundUser.comparePassword(password)) === false) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  const userNoPass = foundUser.toJSON();

  req.session.user = userNoPass;

  res.json({
    success: true,
    message: "User logged in",
    user: userNoPass,
  });
});

export default router;
