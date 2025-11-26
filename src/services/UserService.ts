import Koa from "koa";
import prisma from "../services/prisma.js";
import { UserViews, type UserTypes } from "../types/User.js";
import type { User } from "../generated/prisma/client.js";
import argon2 from "argon2";
import validator from "validator";
import crypto from "crypto";
// import { sendVerificationEmail } from "../services/mail.js";
import { sendWelcomeEmail } from "../services/mail.js";

export class UserService {

  // ---------------------------
  // GET ALL USERS
  // ---------------------------
  async getAll(context: Koa.Context) {
    try {
      const users: UserTypes.UserResponse[] = await prisma.user.findMany({
        select: UserViews.asUser
      }).then(users => users.map(u => ({ ...u, gender: Number(u.gender) })));

      context.status = 200;
      context.body = users;

    } catch (err) {
      console.error("DB error:", err);
      context.status = 500;
      context.body = { error: "database unavailable" };
    }
  }

  // ---------------------------
  // GET USER BY ID
  // ---------------------------
  async getUserById(context: Koa.Context, id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: UserViews.asUser
      });

      if (!user) {
        context.status = 404;
        context.body = { error: "User not found" };
        return;
      }

      context.status = 200;
      context.body = user;

    } catch (err: any) {
      context.status = 500;
      context.body = { error: err };
    }
  }

  // ---------------------------
  // REGISTER USER + EMAIL VERIFICATION
  // ---------------------------
  async createUser(context: Koa.Context) {
  try {
    const requestBody: UserTypes.FormData = JSON.parse(context.request.rawBody);
    const hashedPassword: string = await argon2.hash(requestBody.password);

    const existingEmailUser = await prisma.user.findUnique({
      where: { email: requestBody.email }
    });

    if (existingEmailUser) {
      context.status = 409;
      context.body = { error: "Email already in use" };
      return;
    }

    const user = await prisma.user.create({
      data: {
        name: requestBody.name,
        gender: Number(requestBody.gender),
        email: requestBody.email,
        password: hashedPassword,
        privilege: 45,
      }
    });

    // Probeer e-mail te sturen, maar vang fouten af zodat registratie niet faalt
    let mailError = null;
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (mailErr) {
      mailError = mailErr instanceof Error ? mailErr.message : String(mailErr);
      console.error("Mail error:", mailError);
    }

    context.status = 200;
    context.body = { ok: true, data: user, mailError };
  } catch (err) {
    console.log(err);
    context.status = 500;
    context.body = { error: "Server error" };
  }
}

  // ---------------------------
  // LOGIN
  // ---------------------------
  async login(context: Koa.Context) {
    try {
      const { email, password } = JSON.parse(context.request.rawBody);

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        context.status = 401;
        context.body = { error: "Invalid email or password" };
        return;
      }

      // Check if email is verified
      if (!user.emailVerified) {
        context.status = 403;
        context.body = { error: "Please verify your email before logging in" };
        return;
      }

      // Verify password
      const isValid = await argon2.verify(user.password, password);

      if (!isValid) {
        context.status = 401;
        context.body = { error: "Invalid email or password" };
        return;
      }

      // Successful login
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

    } catch (err) {
      console.error(err);
      context.status = 500;
      context.body = { error: "Server error" };
    }
  }
}
