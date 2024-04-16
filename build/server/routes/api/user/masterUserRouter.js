import { Router } from 'express';
import router from './login.js';
import router$1 from './register.js';
import router$2 from './logout.js';
import router$3 from './friends.js';
import router$4 from './users.js';
import router$5 from './thoughts.js';

const masterUserRouter = Router();
masterUserRouter.use("/login", router);
masterUserRouter.use("/register", router$1);
masterUserRouter.use("/logout", router$2);
masterUserRouter.use("/friends", router$3);
masterUserRouter.use("/users", router$4);
masterUserRouter.use("/thoughts", router$5);

export { masterUserRouter };
//# sourceMappingURL=masterUserRouter.js.map
