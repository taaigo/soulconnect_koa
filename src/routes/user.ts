import Router from "@koa/router";
import prisma from "../services/prisma.js";
import type { Context } from "koa";
import UserController from "../controllers/UserController.js";

const router = new Router();
const controller = new UserController();

router.get('/', async (context: Context) => await controller.index(context));
router.post('/register', async (ctx: Context) => await controller.register(ctx));
router.post('/login', async (ctx: Context) => await controller.login(ctx));
router.get('/verify', async (ctx: Context) => await controller.verify(ctx));

export default router;
