# Export Pages

Minimal HTML shells used by the **Playwright frame-capture pipeline** during MP4 export. These are not user-facing pages.

| File | Render entry | Used for |
|------|--------------|----------|
| `full-show.html` | `src/export/fullShowRenderPage.js` | **Primary** — title menu through credits (~114s) |
| `episode-1.html` | `src/export/renderPage.js` | Legacy — episode shots only (no title menu or opening) |

Output MP4s are written to `exports/episode-1/` (gitignored). Export configuration lives in `src/export/episodeExportConfig.js`.
