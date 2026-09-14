import { handleRequest } from "vanilliapxy";

export default async function handler(req, res) {
  const originalUrl = req.url;
  req.url = req.url.replace(/^\/api\/vanillia/, "\/vanillia");
  try {
    await handleRequest(req, res);
  } finally {
    req.url = originalUrl;
  }
}
