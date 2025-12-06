// utils/dateUtils.js

export function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

export function daysAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatShortDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString();
}
