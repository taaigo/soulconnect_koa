import prisma from "../services/prisma.js";
import Koa from "koa";
import UserService from "../services/UserService.js";

class UserController {
  async index(context: Koa.Context) {
    const users = await prisma.user.findMany();
    context.body = users;
  }

  async register(ctx: Koa.Context) {
    const body = ctx.request.body as any;
    const res = await UserService.register({ name: body?.name, email: body?.email, password: body?.password });
    ctx.status = res.status;
    ctx.body = res.body;
  }

  async login(ctx: Koa.Context) {
    const body = ctx.request.body as any;
    const res = await UserService.login(body?.email, body?.password);
    ctx.status = res.status;
    ctx.body = res.body;
  }

  async verify(ctx: Koa.Context) {
    const token = ctx.query.token as string | undefined;
    const res = await UserService.verify(token);
    ctx.status = res.status;
    ctx.body = res.body;
  }
}

export default UserController;
