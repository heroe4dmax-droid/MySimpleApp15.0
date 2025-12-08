export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatTitle(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}
