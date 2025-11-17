import Router from "@koa/router";
import prisma from "../services/prisma.js";
import UserController from "../controllers/UserController.js";
const router = new Router();
const controller = new UserController();
router.get('/', (context) => {
    const message = controller.index(context);
    context.body = message;
});
export default router;
//# sourceMappingURL=user.js.map