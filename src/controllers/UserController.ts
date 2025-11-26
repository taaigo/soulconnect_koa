import Koa, { type Context } from "koa";
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

  async createAccount(context: Koa.Context) {
    await userService.createUser(context);
    return; 
  }
  async login(context: Context) {
    await userService.login(context);
  }
}

export default UserController;
