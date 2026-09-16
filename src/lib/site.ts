export const TEBEX_STORE_URL = "https://spicymango.tebex.io";

export function tebexHref(url?: string) {
  return url && url !== "#" ? url : TEBEX_STORE_URL;
}