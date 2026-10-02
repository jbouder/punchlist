const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
];

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "just now", "5 minutes ago", "yesterday". */
export function timeAgo(timestamp: number, now = Date.now()): string {
  const delta = timestamp - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(delta) >= ms) {
      return rtf.format(Math.round(delta / ms), unit);
    }
  }
  return 'just now';
}

export function percent(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}
