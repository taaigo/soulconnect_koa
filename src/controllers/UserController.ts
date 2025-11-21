import Koa from "koa";
import { UserService } from "../services/UserService.js";

const userService = new UserService();

class UserController {
  async getAll(context: Koa.Context) {
    await userService.getAll(context);
  }
   
  async show(context: Koa.Context) {
    const id: number = parseInt(context.params.id);
    if (isNaN(id)) {
      context.status = 400;
      context.body = {error: "invalid id"};
      return;
    }
    await userService.getUserById(context, id);
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
