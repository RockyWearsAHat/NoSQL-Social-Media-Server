import { Router } from 'express';

const router = Router();
router.post("/", async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Error logging out" });
        }
        res.json({ success: true, message: "Logged out" });
    });
});

export { router as default };
//# sourceMappingURL=logout.js.map
