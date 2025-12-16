import Koa from "koa";
import prisma from "./prisma.js";
import type { InterestTypes } from "../types/Interest.js";

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
  
  async create(context: Koa.Context) {
    try {
      const requestBody: InterestTypes.FormData = JSON.parse(context.request.rawBody);

      const existingInterest = await prisma.interest.findUnique({
        where: { name: requestBody.name }
      });

      if (existingInterest) {
        context.status = 409;
        context.body = {error: "Interest name already in exists"};
        return;
      }

      let existingCategory = await prisma.interestCategory.findUnique({
        where: { name: requestBody.category }
      });

      if (existingCategory == null) {
        existingCategory = await prisma.interestCategory.create({
          data: {
            name: requestBody.category
          }
        });
      }

      await prisma.interest.create({
        data: {
          name: requestBody.name,
          priority: requestBody.priority,
          category_id: existingCategory.id
        }
      });

      context.status = 200;
      context.body = {ok: true};
    } catch (err) {
      context.status = 500;
      context.body = {error: err};
    }
    return;
  }
}
