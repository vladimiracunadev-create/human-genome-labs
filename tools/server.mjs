import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
const root = resolve(process.argv[2] ?? "dist");
const port = Number(process.env.PORT ?? 4173);
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8", ".webmanifest":"application/manifest+json", ".map":"application/json" };
createServer((request,response)=>{
  const raw = decodeURIComponent((request.url ?? "/").split("?")[0] ?? "/");
  const safe = normalize(raw).replace(/^(\.\.(\/|\|$))+/, "");
  let file = join(root, safe === "/" ? "index.html" : safe);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(root) || !existsSync(file)) { response.writeHead(404); response.end("Not found"); return; }
  response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Cache-Control":"no-cache" });
  createReadStream(file).pipe(response);
}).listen(port,"127.0.0.1",()=>console.log(`Human Genome Labs: http://127.0.0.1:${port}`));
