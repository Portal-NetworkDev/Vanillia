export default async function handler(req, res) {
  const backend = process.env.SCRAMJET_BACKEND_URL;
  if (!backend) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Scramjet backend is not configured.');
    return;
  }
  const target = new URL(req.url.replace(/^\/api\/scramjet/, ''), backend);
  const response = await fetch(target, { method: req.method, headers: req.headers });
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
