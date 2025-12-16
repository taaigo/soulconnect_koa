import Koa from "koa";
import router from "./router.js";
import bodyParser from "koa-bodyparser";
// @ts-ignore
import cors from "@koa/cors";
import dotenv from "dotenv";

dotenv.config();
const app = new Koa();

app.use(cors({
  origin: "http://localhost:5173",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"]
}));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
