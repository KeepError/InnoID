export function getSafeCurrentPath(): string {
  return encodeURIComponent(window.location.pathname + window.location.search);
}
