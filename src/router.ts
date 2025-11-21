import Router from "@koa/router";
import fg from "fast-glob";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = new Router();

// Look for compiled JS in target (production) or TS in src (dev with ts-node)
const routeFiles = fg.sync(["target/routes/**/*.js", "src/routes/**/*.ts"], { absolute: true });
console.log('Route files found:', routeFiles);
routeFiles.forEach((file) => {
  import(file).then((module) => {
    if (module.default) {
      // Normalize path separators for cross-platform behavior
      const normalized = file.replace(/\\/g, '/');
      const idx = normalized.lastIndexOf('/routes/');
      const relativePath = idx !== -1 ? normalized.slice(idx + '/routes/'.length) : path.basename(normalized);
      const routePath = '/api/' + relativePath.replace(/\.(js|ts)$/, '').replace(/\//g, '/');
      router.use(routePath, module.default.routes(), module.default.allowedMethods());
      console.log(`Loaded route ${routePath}`);
    }
  }).catch((err) => console.error('Failed to import route', file, err));
});

export default router;
