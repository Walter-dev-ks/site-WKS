import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve('dist');
const clients = new Set();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.png': 'image/png', '.gif': 'image/gif' };
let rebuilding = false;
let pending = false;
let timer;

async function rebuild() {
  if (rebuilding) { pending = true; return; }
  rebuilding = true;
  const code = await new Promise((done, reject) => {
    const child = spawn(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit', windowsHide: true });
    child.on('error', reject);
    child.on('exit', done);
  });
  rebuilding = false;
  if (code === 0) {
    for (const client of clients) client.write('data: reload\n\n');
  } else {
    console.error('Build failed. Save the corrected file to try again.');
  }
  if (pending) { pending = false; return rebuild(); }
  return code === 0;
}

if (!await rebuild()) process.exit(1);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/__dev/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write(': connected\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    const file = resolve(root, '.' + decodeURIComponent(pathname));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const path = file === root ? resolve(root, 'index.html') : file;
    let body = await readFile(path);
    if (extname(path) === '.html') {
      body = body.toString().replace('</body>', `<script>new EventSource('/__dev/events').onmessage = () => location.reload();</script></body>`);
    }
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
});
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(5174, '127.0.0.1', () => console.log('Local: http://127.0.0.1:5174 — automatic rebuild and reload enabled'));

const watchers = ['src', 'public', 'index.html'].map(path => watch(path, { recursive: path !== 'index.html' }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => rebuild().catch(console.error), 250);
}));
function shutdown() {
  clearTimeout(timer);
  for (const watcher of watchers) watcher.close();
  for (const client of clients) client.end();
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
