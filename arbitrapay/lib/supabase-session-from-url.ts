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
    console.log("OAUTH URL:", url);

    // -----------------------------
    // PKCE FLOW (code exchange)
    // -----------------------------
    const codeMatch = url.match(/[?&]code=([^&#]+)/);

    if (codeMatch) {
      const code = codeMatch[1];

      console.log("PKCE CODE FOUND:", code.substring(0, 10) + "...");

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("PKCE exchange failed:", error.message);
        return false;
      }

      console.log("SESSION CREATED VIA PKCE, user:", data.session?.user?.email);
      return true;
    }

    // -----------------------------
    // IMPLICIT FLOW (token fragment)
    // -----------------------------
    if (!url.includes("#")) {
      console.log("NO AUTH PARAMS IN URL:", url);
      return false;
    }

    const fragment = url.split("#")[1];
    const params = new URLSearchParams(fragment);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    console.log("ACCESS TOKEN:", accessToken ? "FOUND" : "MISSING");
    console.log("REFRESH TOKEN:", refreshToken ? "FOUND" : "MISSING");

    if (!accessToken || !refreshToken) {
      console.log("TOKENS NOT PRESENT IN URL");
      return false;
    }

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Failed to set session from tokens:", error.message);
      return false;
    }

    console.log("SESSION SET SUCCESSFULLY, user:", data.session?.user?.email);
    return true;

  } catch (err) {
    console.error("Error extracting session from URL:", err);
    return false;
  }
}
