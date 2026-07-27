/**
 * Vite config — dev server plus custom /api/export middleware for MP4 export.
 * The export API launches Playwright frame capture and FFmpeg encoding.
 */
import { defineConfig } from 'vite';
import {
  createExportApiMiddleware,
  setExportProgressBroadcaster,
} from './server/export/exportRoutes.js';

const exportClients = new Set();

function getBaseUrl(server) {
  const address = server.httpServer?.address();
  if (!address || typeof address === 'string') {
    return 'http://127.0.0.1:5173';
  }

  const host = address.address === '::' ? '127.0.0.1' : address.address;
  return `http://${host}:${address.port}`;
}

export default defineConfig({
  server: {
    host: '127.0.0.1',
    fs: {
      allow: ['.', 'export'],
    },
  },
  plugins: [
    {
      name: 'bandito-export-api',
      configureServer(server) {
        setExportProgressBroadcaster((episodeId, progress) => {
          const payload = `data: ${JSON.stringify({ episodeId, ...progress })}\n\n`;
          for (const client of exportClients) {
            client.write(payload);
          }
        });

        server.middlewares.use(
          createExportApiMiddleware({
            getBaseUrl: () => getBaseUrl(server),
          }),
        );

        server.middlewares.use('/api/export/events', (req, res) => {
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end();
            return;
          }

          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          });

          res.write(':\n\n');
          exportClients.add(res);

          req.on('close', () => {
            exportClients.delete(res);
          });
        });
      },
    },
  ],
});
