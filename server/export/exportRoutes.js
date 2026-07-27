import { createReadStream, existsSync } from 'node:fs';
import { getEpisodeExportConfig } from '../../src/export/episodeExportConfig.js';
import {
  exportEpisode,
  getActiveExportJob,
  getExportOutputInfo,
} from './exportEpisode.js';
import { checkFfmpeg } from './checkFfmpeg.js';

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

export function createExportApiMiddleware({ getBaseUrl }) {
  return async function exportApiMiddleware(req, res, next) {
    if (!req.url?.startsWith('/api/export')) {
      next();
      return;
    }

    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    try {
      if (pathname === '/api/export/check' && req.method === 'GET') {
        const ffmpeg = checkFfmpeg();
        sendJson(res, 200, {
          ffmpeg: ffmpeg.ok,
          error: ffmpeg.ok ? null : ffmpeg.error,
          activeJob: Boolean(getActiveExportJob()),
        });
        return;
      }

      if (pathname === '/api/export/start' && req.method === 'POST') {
        if (getActiveExportJob()) {
          sendJson(res, 409, {
            ok: false,
            error: 'Another export is already in progress',
          });
          return;
        }

        const body = await readJsonBody(req);
        const episodeId = body.episodeId ?? 'episode-1';
        const testDurationSec =
          body.testDurationSec != null ? Number(body.testDurationSec) : null;

        getEpisodeExportConfig(episodeId);

        res.statusCode = 202;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ok: true,
            episodeId,
            message: 'Export started',
          }),
        );

        exportEpisode({
          episodeId,
          baseUrl: getBaseUrl(),
          testDurationSec,
          onProgress: (progress) => {
            broadcastExportProgress?.(episodeId, progress);
          },
        }).then((result) => {
          broadcastExportProgress?.(episodeId, {
            phase: result.ok ? 'complete' : 'failed',
            message: result.ok ? 'Export complete' : 'Export failed',
            percent: result.ok ? 100 : 0,
            outputPath: result.outputPath,
            error: result.error ?? null,
            validation: result.validation ?? null,
          });
        });

        return;
      }

      const statusMatch = pathname.match(/^\/api\/export\/status\/([^/]+)$/);
      if (statusMatch && req.method === 'GET') {
        const episodeId = statusMatch[1];
        const output = getExportOutputInfo(episodeId);
        const exists = existsSync(output.outputPath);

        sendJson(res, 200, {
          activeJob: Boolean(getActiveExportJob()),
          outputExists: exists,
          ...output,
        });
        return;
      }

      const downloadMatch = pathname.match(/^\/api\/export\/download\/([^/]+)$/);
      if (downloadMatch && req.method === 'GET') {
        const episodeId = downloadMatch[1];
        const config = getEpisodeExportConfig(episodeId);
        const output = getExportOutputInfo(episodeId);

        if (!existsSync(output.outputPath)) {
          sendJson(res, 404, { ok: false, error: 'Export file not found' });
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${config.outputFilename}"`,
        );
        createReadStream(output.outputPath).pipe(res);
        return;
      }

      sendJson(res, 404, { ok: false, error: 'Not found' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 500, { ok: false, error: message });
    }
  };
}

/** @type {((episodeId: string, progress: object) => void) | null} */
let broadcastExportProgress = null;

export function setExportProgressBroadcaster(handler) {
  broadcastExportProgress = handler;
}
