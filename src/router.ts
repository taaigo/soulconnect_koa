import Router from "@koa/router";
import fg from "fast-glob";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = new Router();

// Load all route files
const routeFiles = fg.sync("target/routes/**/*.js", { absolute: true });
console.log(routeFiles);

routeFiles.forEach(async (file) => {
  // Convert Windows path → file:// URL
  const moduleURL = pathToFileURL(file).href;

  const module = await import(moduleURL);

  if (module.default) {
    const relativePath = path.relative(path.join(__dirname, "routes"), file);
    const routePath = "/api/" + relativePath
      .replace(/\.js$/, "")
      .replace(/\\/g, "/");

    router.use(routePath, module.default.routes(), module.default.allowedMethods());
    console.log(`Loaded route ${routePath}`);
  }
});

export default router;
