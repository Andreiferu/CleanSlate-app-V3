export function formatNumber(n, locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(n) || 0);
  } catch {
    return String(n);
  }
}

export function formatDate(d, locale = 'en-US', options) {
  try {
    const date = d instanceof Date ? d : new Date(d);
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: '2-digit', ...(options || {}) }).format(date);
  } catch {
    return String(d);
  }
}

export function titleCase(str = '') {
  return String(str)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function truncate(str = '', max = 80) {
  const s = String(str);
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
