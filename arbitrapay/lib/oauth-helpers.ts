/**
 * Extract OAuth callback parameters from a redirect URL.
 *
 * Supabase PKCE redirects append params as a query string _or_ as a fragment,
 * depending on the provider and flow. This helper handles both cases as well
 * as the common pattern where the fragment contains query-style key=value pairs.
 */
export function extractOAuthParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};

  try {
    const parsed = new URL(url);

    // 1. Query-string params  (e.g. ?code=abc&...)
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // 2. Fragment params       (e.g. #access_token=xyz&...)
    if (parsed.hash) {
      const fragment = parsed.hash.startsWith("#")
        ? parsed.hash.slice(1)
        : parsed.hash;
      const fragmentParams = new URLSearchParams(fragment);
      fragmentParams.forEach((value, key) => {
        params[key] = value;
      });
    }
  } catch {
    // Fallback: try to extract params manually for non-standard URLs
    const queryIndex = url.indexOf("?");
    const hashIndex = url.indexOf("#");

    const raw =
      queryIndex !== -1
        ? url.slice(queryIndex + 1)
        : hashIndex !== -1
          ? url.slice(hashIndex + 1)
          : "";

    if (raw) {
      const fallbackParams = new URLSearchParams(raw);
      fallbackParams.forEach((value, key) => {
        params[key] = value;
      });
    }
  }

  return params;
}
