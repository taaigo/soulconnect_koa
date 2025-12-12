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

router.get("/verify", async (context: Context) => {
  await controller.verifyEmail(context);
});

router.post("/login", async (context: Context) => {
  await controller.login(context);
});

router.get("/:id", async (context: Context) => {
  // If it looks like a token, treat it as verify
  if (context.params.id === "verify") {
    await controller.verifyEmail(context);
  } else {
    await controller.show(context);
  }
});

export default router;
