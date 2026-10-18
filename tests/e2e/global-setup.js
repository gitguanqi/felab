import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const PORT = 4011;
const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

export default async function globalSetup() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', `http://127.0.0.1:${PORT}`);
      let pathname;
      try {
        pathname = decodeURIComponent(requestUrl.pathname);
      } catch {
        response.writeHead(400);
        response.end('Bad request');
        return;
      }

      let absolutePath = path.resolve(ROOT, `.${pathname}`);
      if (absolutePath !== ROOT && !absolutePath.startsWith(`${ROOT}${path.sep}`)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }

      const currentStat = await stat(absolutePath);
      if (currentStat.isDirectory()) {
        if (!requestUrl.pathname.endsWith('/')) {
          response.writeHead(301, { Location: `${requestUrl.pathname}/` });
          response.end();
          return;
        }
        absolutePath = path.join(absolutePath, 'index.html');
      }

      const content = await readFile(absolutePath);
      response.writeHead(200, {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': MIME_TYPES.get(path.extname(absolutePath)) ?? 'application/octet-stream',
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolve(undefined));
  });

  return async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  };
}
