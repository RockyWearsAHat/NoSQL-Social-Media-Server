import { Router } from 'express';
import User from '../../../../db/models/user.js';

const router = Router();
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.json({
            success: false,
            message: "Username, email and password are required",
        });
    }
    const foundUser = (await User.findOne({ username })) || (await User.findOne({ email }));
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

export { router as default };
//# sourceMappingURL=register.js.map
