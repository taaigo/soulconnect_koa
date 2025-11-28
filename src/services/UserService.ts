import Koa from "koa";
import prisma from "../services/prisma.js";
import { UserViews, type UserTypes } from "../types/User.js";
import type { User } from "../generated/prisma/client.js";
import argon2 from "argon2";
import { textSpanContainsTextSpan } from "typescript";

export class UserService {
  async getAll(context: Koa.Context) {
    try {
      const users: UserTypes.UserResponse[] = await prisma.user.findMany({
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

    try {
      const requestBody: UserTypes.FormData = JSON.parse(context.request.rawBody);

      const hashedPassword: string = await argon2.hash(requestBody.password);

      const existingEmailUser = await prisma.user.findUnique({
        where: { email: requestBody.email }
      });

      if (existingEmailUser) {
        context.status = 409;
        context.body = {error: "Email already in use"};
        return;
      }

      const user: User | null = await prisma.user.create({
        data: {
          name: requestBody.name,
          gender: requestBody.gender,
          email: requestBody.email,
          password: hashedPassword,
          privilege: 45,
        }
      });

      context.status = 200;
      context.body = {ok: true, data: user};
    } catch (err) {
      context.status = 500;
      context.body = {error: err};
    }
    return;
  }

  async login(context: Koa.Context) {
    try {
      const { email, password } = JSON.parse(context.request.rawBody);
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        context.status = 401;
        context.body = { error: "Invalid email or password" };
        return;
      }

      const isValid: boolean = await argon2.verify(user.password, password);

      if (!isValid) {
        context.status = 401;
        context.body = { error: "Invalid email or password" };
        return;
      }

      if (user.privilege == 45) {
        context.status = 403;
        context.body = { error: "Please verify your email before logging in"};
        return;
      }

      context.status = 200;
      context.body = {
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          gender: user.gender,
          email: user.email,
          privilege: user.privilege
        }
      };

    } catch(err) {
      console.error(err);
      context.status = 500;
      context.body = { error: "Server error" };
    }
  }
}
