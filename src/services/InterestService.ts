import Koa from "koa";
import prisma from "./prisma.js";

export class InterestService {
  async getAll(context: Koa.Context) {
    try {
      const interests = await prisma.interest.findMany();
      context.status = 200;
      context.body = interests;
    } catch (err) {
      console.error("DB error: ", err)

      context.status = 500;
      context.body = {error: "database unavailable"};
    }
    return;
  } 
}
