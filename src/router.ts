import Router from "@koa/router";
import fg from "fast-glob";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = new Router();

const routeFiles = fg.sync("target/routes/**/*.js", {absolute: true});
console.log(routeFiles);
routeFiles.forEach((file) => {
  import(file).then((module) => {
    if (module.default) {
      const relativePath = path.relative(path.join(__dirname, "routes"), file);
      const routePath = "/api/" + relativePath.replace(/\.js$/, '').replace(/\\/g, '/');
      router.use(routePath, module.default.routes(), module.default.allowedMethods());
      console.log(`Loaded route ${routePath}`);
    }
  });
});

export default router;
