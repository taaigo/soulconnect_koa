import Koa from "koa";
import type { User as dbUser } from "../../generated/prisma/client.js";

export async function requireUser(context: Koa.Context, next: Koa.Next) {
  const user: dbUser = context.state.user;

  if (!user) {
    context.status = 401;
    return;
  }

  if (user.privilege < 50) {
    context.status = 403;
    context.body = { error: "Forbidden" };
    return;
  }

  await next();
}
