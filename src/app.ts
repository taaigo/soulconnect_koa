import Koa from "koa";
import router from "./router.js";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";

dotenv.config();
const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
