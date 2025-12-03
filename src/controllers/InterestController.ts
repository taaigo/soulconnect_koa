import Koa from "koa";
import { InterestService } from "../services/InterestService.js";

const interestService = new InterestService();

class InterestController {
  async getAll(context: Koa.Context) {
    interestService.getAll(context);
  }

  async index(context: Koa.Context) {}

  async create(context: Koa.Context) {}
}
export default InterestController;
