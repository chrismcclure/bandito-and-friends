/** Visual indicator colors for Threat Board entry status. */
export const THREAT_STATUS_COLORS = {
  normal: 0x99aabb,
  watch: 0xddcc44,
  warning: 0xff9944,
  safe: 0x66cc88,
};

/**
 * @typedef {Object} ThreatBoardEntry
 * @property {string} label
 * @property {string} value
 * @property {'normal' | 'watch' | 'warning' | 'safe'} status
 */

/**
 * @typedef {Object} ThreatBoardData
 * @property {string} title
 * @property {number} threatLevel
 * @property {ThreatBoardEntry[]} entries
 */

/** Validate and normalize threat board configuration data. */
export function normalizeThreatBoardData(data) {
  return {
    title: data.title ?? 'MEOW CITY THREAT BOARD',
    threatLevel: data.threatLevel ?? 1,
    entries: (data.entries ?? []).map((entry) => ({
      label: entry.label ?? '',
      value: entry.value ?? '',
      status: entry.status ?? 'normal',
    })),
  };
}
