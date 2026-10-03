// Files served next to this module (fonts, images). The module URL may carry a
// cache-busting query, so only the directory part is kept.
const BASE = import.meta.url.replace(/[^/]*$/, "");

export const asset = (path: string): string => `${BASE}${path}`;
