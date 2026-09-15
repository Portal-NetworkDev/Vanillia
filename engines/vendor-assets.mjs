import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";

const root = new URL("./public/", import.meta.url);
const paths = [
  [baremuxPath, new URL("./baremux/", root)],
  [scramjetPath, new URL("./scram/", root)],
  [libcurlPath, new URL("./libcurl/", root)],
  [epoxyPath, new URL("./epoxy/", root)],
  [uvPath, new URL("./uv/", root)]
];

for (const [, destination] of paths) {
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
}

for (const [source, destination] of paths) {
  await cp(source, destination, { recursive: true });
}

await writeFile(new URL("./uv/uv.config.js", root), `/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
`);
