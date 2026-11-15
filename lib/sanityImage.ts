// Ask Sanity's image CDN for a right-sized, modern-format copy instead of the
// original upload. `auto=format` serves WebP/AVIF where the browser supports
// it. Non-Sanity URLs (e.g. files in /public) pass through untouched.
export function sized(url: string, width: number): string {
  if (!url.includes("cdn.sanity.io")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&auto=format&q=75`;
}
