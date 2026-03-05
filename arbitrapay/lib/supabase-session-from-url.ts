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

      console.log("PKCE CODE FOUND:", code);

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Failed to exchange code for session:", error.message);
        return false;
      }

      console.log("SESSION CREATED VIA PKCE");
      return true;
    }

    // -----------------------------
    // IMPLICIT FLOW (token fragment)
    // -----------------------------
    if (!url.includes("#")) {
      console.log("NO FRAGMENT FOUND IN URL");
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

    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Failed to set session from tokens:", error.message);
      return false;
    }

    console.log("SESSION SET SUCCESSFULLY");
    return true;

  } catch (err) {
    console.error("Error extracting session from URL:", err);
    return false;
  }
}