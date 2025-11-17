import Router from "@koa/router";
import TestController from "../controllers/test.js";
import type { Context } from "koa";

const router = new Router();
const controller = new TestController();

router.get('/', (context: Context) => {
  const message = controller.getHello();
  context.body = message;
});


export default router;
