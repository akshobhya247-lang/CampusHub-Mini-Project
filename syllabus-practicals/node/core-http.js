import http from 'node:http';
import { URL } from 'node:url';
import { readFile } from 'node:fs/promises';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, method: req.method, query: Object.fromEntries(url.searchParams) }));
  }
  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end('<!doctype html><html><body><h1>Node.js HTTP practical</h1><p>Try /health?student=demo</p></body></html>');
  }
  res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found');
});
server.listen(3101, () => console.log('HTTP practical: http://localhost:3101'));
