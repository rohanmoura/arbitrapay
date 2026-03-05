import { supabase } from "./supabase";

/**
 * Extracts OAuth session tokens from a redirect URL and sets the Supabase session.
 *
 * Supports both:
 * - PKCE flow: URL contains ?code=... query parameter
 * - Implicit flow: URL contains #access_token=...&refresh_token=... fragment
 *
 * Returns true if a session was successfully established.
 */
export async function setSessionFromUrl(url: string): Promise<boolean> {
  try {
    // PKCE flow: extract authorization code from query params
    const codeMatch = url.match(/[?&]code=([^&#]+)/);
    if (codeMatch) {
      const code = codeMatch[1];
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Failed to exchange code for session:", error.message);
        return false;
      }
      return true;
    }

    // Implicit flow: extract tokens from URL fragment
    const fragmentString = url.includes("#") ? url.split("#")[1] : "";
    if (!fragmentString) return false;

    const params = new URLSearchParams(fragmentString);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        console.error("Failed to set session from tokens:", error.message);
        return false;
      }
      return true;
    }

    return false;
  } catch (err) {
    console.error("Error extracting session from URL:", err);
    return false;
  }
}
