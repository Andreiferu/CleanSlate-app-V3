export function average(arr) {
  if (!arr?.length) return 0;
  const sum = arr.reduce((a, b) => a + (Number(b) || 0), 0);
  return sum / arr.length;
}

export function percentile(arr, p = 0.95) {
  if (!arr?.length) return 0;
  const sorted = [...arr].map(Number).sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
  return sorted[idx];
}

export function movingAverage(arr, window = 7) {
  if (!arr?.length || window <= 0) return [];
  const out = [];
  for (let i = 0; i < arr.length; i += 1) {
    const start = Math.max(0, i - window + 1);
    out.push(average(arr.slice(start, i + 1)));
  }
  return out;
}
