# Google OAuth Session Persistence - Root Cause Analysis

## Problem
Google OAuth redirects back to the app successfully, but no Supabase session is created. `Linking.getInitialURL()` returns null. `Linking.addEventListener("url")` never fires. `exchangeCodeForSession()` is never called.

## Root Cause: `openAuthSessionAsync` result discarded at `login.tsx:85`

The authorization code is reliably delivered — but no code path reads it.

### How `expo-web-browser` works on Android

`WebBrowser.openAuthSessionAsync()` opens a Chrome Custom Tab. When the redirect URL (`arbitrapay://?code=AUTH_CODE`) fires, the `expo-web-browser` plugin's `WebBrowserRedirectActivity` **intercepts the Android intent** before `expo-linking` ever sees it. It closes the Chrome Tab and resolves the JS promise with `{ type: "success", url: "arbitrapay://?code=AUTH_CODE" }`.

This means:
- `Linking.addEventListener("url")` **never fires** — the intent was consumed by `WebBrowserRedirectActivity`
- `Linking.getInitialURL()` **returns null** — the app wasn't launched via a standard VIEW intent

The **only** place the auth code is available is the return value of `openAuthSessionAsync`.

### The bug (login.tsx:84-86)

```typescript
if (data?.url) {
  await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  // ← Return value containing the auth code is silently discarded
}
```

The promise resolves with the redirect URL containing `?code=AUTH_CODE`. The code throws it away. `exchangeCodeForSession()` in AuthContext never runs because neither deep link handler receives the URL.

### Cold-start variant

When Android kills the app while Chrome is open, the `openAuthSessionAsync` promise dies with the process. On cold-start, `WebBrowserRedirectActivity` forwards the intent to the main activity, but through its internal mechanism — not as a standard deep link. `Linking.getInitialURL()` returns null for the same reason.

### Why OTP works

OTP never leaves the app process. No browser redirect, no deep link, no `openAuthSessionAsync`. The session is created entirely in-process via `verifyOtp()`.

## Fix applied: `login.tsx`

Capture the `openAuthSessionAsync` result and exchange the code immediately:

```typescript
const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
if (result.type === "success" && result.url) {
  const url = new URL(result.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.log("OAuth code exchange error:", error.message);
    }
  }
}
```

The PKCE `code_verifier` is already in AsyncStorage (stored by `signInWithOAuth`). Since this is the same process and same Supabase client instance, `exchangeCodeForSession` will find it and complete the exchange. The session is persisted, `onAuthStateChange` fires, and the user navigates to the app.
