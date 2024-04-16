import { Router } from 'express';

const router = Router();
// Middleware for authorization
const withAuth = (req, res, next) => {
    if (!req.session.user)
        return res.json({ success: false, message: "User not logged in" });
    else
        next();
};

export { router as default, withAuth };
//# sourceMappingURL=authMiddleware.js.map
