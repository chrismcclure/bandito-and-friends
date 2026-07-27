const EPISODE_ID = 'episode-1';

function formatPercent(percent) {
  return `${Math.max(0, Math.min(100, percent))}%`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export function createExportClient({
  episodeId = EPISODE_ID,
  onStatusChange,
} = {}) {
  let eventSource = null;
  let exporting = false;

  function setStatus(partial) {
    onStatusChange?.({
      exporting,
      ...partial,
    });
  }

  function connectEvents() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource('/api/export/events');

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.episodeId !== episodeId) {
        return;
      }

      const percent = payload.percent ?? 0;
      setStatus({
        exporting: payload.phase !== 'complete' && payload.phase !== 'failed',
        phase: payload.phase,
        message: payload.message,
        percent,
        percentLabel: formatPercent(percent),
        currentFrame: payload.currentFrame,
        totalFrames: payload.totalFrames,
        outputPath: payload.outputPath,
        error: payload.error,
        downloadUrl:
          payload.phase === 'complete'
            ? `/api/export/download/${episodeId}`
            : null,
      });

      if (payload.phase === 'complete' || payload.phase === 'failed') {
        exporting = false;
        eventSource?.close();
        eventSource = null;
      }
    };

    eventSource.onerror = () => {
      // SSE reconnects automatically while exporting.
    };
  }

  async function checkEnvironment() {
    const result = await fetchJson('/api/export/check');
    return result;
  }

  async function startExport({ testDurationSec = null } = {}) {
    if (exporting) {
      throw new Error('Export already in progress');
    }

    const env = await checkEnvironment();
    if (!env.ffmpeg) {
      throw new Error(env.error || 'FFmpeg is not available');
    }

    if (env.activeJob) {
      throw new Error('Another export is already in progress');
    }

    exporting = true;
    connectEvents();

    setStatus({
      exporting: true,
      phase: 'preparing',
      message: 'Preparing assets',
      percent: 0,
      percentLabel: '0%',
      error: null,
      downloadUrl: null,
    });

    await fetchJson('/api/export/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        episodeId,
        testDurationSec,
      }),
    });
  }

  function dispose() {
    eventSource?.close();
    eventSource = null;
  }

  return {
    checkEnvironment,
    startExport,
    dispose,
  };
}
