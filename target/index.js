import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(async (context, next) => {
    try {
        await next();
    }
    catch (err) {
        context.status = err.status || 500;
        context.body = { error: err.message };
    }
});
app.listen(9000, () => {
    console.log("Server started");
});
//# sourceMappingURL=index.js.map