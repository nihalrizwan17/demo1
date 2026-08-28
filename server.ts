import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = 8000;
const HOST = "127.0.0.1";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${HOST}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";

    // Serve the client animation source as transpiled JS on the fly.
    if (pathname === "/client.js") {
      const ts = await readFile(join(ROOT, "client.ts"), "utf-8");
      const { code } = transformSync(ts, { loader: "ts", format: "esm" });
      res.writeHead(200, { "Content-Type": MIME[".js"] });
      res.end(code);
      return;
    }

    const safePath = normalize(join(ROOT, pathname)).replace(/^(\.\.(\/|\\|$))+/, "");
    const data = await readFile(safePath);
    const type = MIME[extname(safePath)] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`▶ demo1 running at http://${HOST}:${PORT}`);
});
