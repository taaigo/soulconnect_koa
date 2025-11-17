import Router from "@koa/router";
import TestController from "../controllers/test.js";
const router = new Router();
const controller = new TestController();
router.get('/', (context) => {
    const message = controller.getHello();
    context.body = message;
});
export default router;
//# sourceMappingURL=test.js.map