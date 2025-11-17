import prisma from "../services/prisma.js";
import Koa from "koa";

class UserController {
  async index(context: Koa.Context) {
    const users = await prisma.user.findMany();
    context.body = users;
  }
}

export default UserController;
