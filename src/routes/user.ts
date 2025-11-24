import Router from "@koa/router";
import prisma from "../services/prisma.js";
import type { Context } from "koa";
import UserController from "../controllers/UserController.js";

const router = new Router();
const controller = new UserController();

router.get('/', async (context: Context) => {
  await controller.getAll(context);
});

router.post("/register", async (context: Context) => {
  await controller.createAccount(context);
});

router.get("/:id", async (context: Context) => {
  await controller.show(context);
});

export default router;
