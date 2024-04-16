import { Router } from 'express';
import { masterUserRouter } from './user/masterUserRouter.js';

const apiRouter = Router();
apiRouter.use("/user", masterUserRouter);

export { apiRouter };
//# sourceMappingURL=masterAPIRouter.js.map
