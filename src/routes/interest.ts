import Router from "@koa/router";
import type { Context } from "koa";
import InterestController from "../controllers/InterestController.js";

const router = new Router();
const controller = new InterestController();

router.get('/', async (context: Context) => {
  context.body = "bruh";
  return;
});

export default router;
