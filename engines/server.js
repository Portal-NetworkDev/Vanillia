import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

const publicPath = fileURLToPath(new URL("./public/", import.meta.url));
const fastify = Fastify({
  serverFactory: handler => createServer()
    .on("request", (req, res) => handler(req, res))
    .on("upgrade", (req, socket, head) => {
      if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
      else socket.end();
    })
});

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
  allow_udp_streams: false,
  dns_servers: ["1.1.1.1", "1.0.0.1"]
});

fastify.register(fastifyStatic, { root: publicPath, decorateReply: true });
fastify.register(fastifyStatic, { root: join(publicPath, "scram"), prefix: "/scram/", decorateReply: false });
fastify.register(fastifyStatic, { root: join(publicPath, "libcurl"), prefix: "/libcurl/", decorateReply: false });
fastify.register(fastifyStatic, { root: join(publicPath, "baremux"), prefix: "/baremux/", decorateReply: false });
fastify.register(fastifyStatic, { root: join(publicPath, "uv"), prefix: "/uv/", decorateReply: false });
fastify.register(fastifyStatic, { root: join(publicPath, "epoxy"), prefix: "/epoxy/", decorateReply: false });

const sendEngine = async (request, reply, file) => {
  const target = new URL(request.url, "http://localhost").searchParams.get(file === "scramjet.html" ? "portal" : "class");
  const html = await readFile(join(publicPath, file), "utf8");
  reply.type("text/html").send(html.replace("__VANILLIA_TARGET__", target || ""));
};

fastify.get("/education", (request, reply) => sendEngine(request, reply, "scramjet.html"));
fastify.get("/classroom", (request, reply) => sendEngine(request, reply, "ultraviolet.html"));
fastify.get("/health", async () => ({ ok: true }));
fastify.setNotFoundHandler((request, reply) => reply.code(404).type("text/plain").send("Not found"));

const port = Number.parseInt(process.env.PORT || "4141", 10);
await fastify.listen({ port, host: "0.0.0.0" });
