import Koa from "koa";
import prisma from "../services/prisma.js";
import { UserViews, type UserTypes } from "../types/User.js";
import type { User } from "../generated/prisma/client.js";
import argon2 from "argon2";

export class UserService {
  async getAll(context: Koa.Context) {
    try {
      const users: UserTypes.UserResponse [] = await prisma.user.findMany({
        select: UserViews.asUser
      });
      context.status = 200;
      context.body = users;
    } catch (err) {
      console.error("DB error:", err);

      context.status = 500;
      context.body = { error: "database unavailable" };
    }
    return;
  }

  async getUserById(context: Koa.Context, id: number) {
    try {
      const user: UserTypes.UserResponse | null = await prisma.user.findUnique({
        where: {
          id: id
        },
        select: UserViews.asUser 
      });
      context.status = 200;
      context.body = user;

      if (user == null) {
        context.status = 404;
        context.body = {error: "User not found"};
      }
    } catch (err: any) {
      context.status = 500;
      context.body = {error: err};
    }
    return;
  }

  async createUser(context: Koa.Context) {
    context.status = 200;
    context.body = context.request.body; 

    const requestBody: UserTypes.FormData = JSON.parse(context.request.rawBody);

    const hashedPassword: string = await argon2.hash(requestBody.password);

    const user: User | null = await prisma.user.create({
      data: {
        name: requestBody.name,
        gender: requestBody.gender,
        email: requestBody.email,
        password: hashedPassword,
        privilege: 45,
      }
    });
    return;
  }
}
