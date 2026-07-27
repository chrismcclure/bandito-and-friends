export const EXPORT_PHASES = {
  PREPARING: 'preparing',
  RENDERING_FRAMES: 'rendering-frames',
  MIXING_AUDIO: 'mixing-audio',
  ENCODING: 'encoding',
  VALIDATING: 'validating',
  COMPLETE: 'complete',
  FAILED: 'failed',
};

export const EXPORT_STATUS_LABELS = {
  [EXPORT_PHASES.PREPARING]: 'Preparing assets',
  [EXPORT_PHASES.RENDERING_FRAMES]: 'Rendering frames',
  [EXPORT_PHASES.MIXING_AUDIO]: 'Mixing audio',
  [EXPORT_PHASES.ENCODING]: 'Encoding MP4',
  [EXPORT_PHASES.VALIDATING]: 'Validating output',
  [EXPORT_PHASES.COMPLETE]: 'Export complete',
  [EXPORT_PHASES.FAILED]: 'Export failed',
};

/**
 * @typedef {Object} ExportProgress
 * @property {string} phase
 * @property {string} message
 * @property {number} percent
 * @property {number} [currentFrame]
 * @property {number} [totalFrames]
 * @property {string} [outputPath]
 * @property {string} [error]
 */

/**
 * @typedef {Object} ExportJobOptions
 * @property {string} episodeId
 * @property {string} [baseUrl]
 * @property {number} [testDurationSec]
 * @property {(progress: ExportProgress) => void} [onProgress]
 */

/**
 * @typedef {Object} ExportJobResult
 * @property {boolean} ok
 * @property {string} outputPath
 * @property {import('./validateOutput.js').ExportValidation} [validation]
 * @property {string} [error]
 * @property {number} durationMs
 */
