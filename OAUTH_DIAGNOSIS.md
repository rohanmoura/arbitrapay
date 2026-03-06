# Google OAuth Session Persistence - Diagnosis

## Problem Summary
Google OAuth flow completes (browser opens, user authenticates, redirect back to app works) but Supabase session is never established. App remains on login screen. OTP login works correctly, confirming AsyncStorage and AuthContext are functional.

## Root Cause Analysis (Ranked by Probability)

### 1. PKCE Code Verifier Lost on App Cold-Start (HIGH - ~80%)

The PKCE flow requires a `code_verifier` (generated during `signInWithOAuth`) to be available when `exchangeCodeForSession(code)` is called. Console logs show the JS bundle reloads after OAuth redirect, indicating Android kills the app process while the browser is open.

When the app cold-starts from the deep link:
- A fresh Supabase client is created
- `exchangeCodeForSession(code)` is called in `initSession()`
- But the code_verifier stored by the original Supabase instance may not survive process death

The WebCrypto warning ("Code challenge method will default to use plain instead of sha256") confirms PKCE is using the `plain` method, but the exchange still requires the stored verifier.

**Verification:** Add error logging to `exchangeCodeForSession()` in `AuthContext.tsx:114`.

### 2. Deep Link URL Not Captured by Either Handler (MEDIUM-HIGH - ~60%)

Race condition between deep link delivery and handler registration:
- `Linking.getInitialURL()` may return `null` if expo-router consumes the URL first
- `Linking.addEventListener("url")` is not registered at cold-start time when the link arrives

**Evidence:** `INITIAL SESSION: null` in logs suggests the code was never exchanged.

### 3. `openAuthSessionAsync` Return Value Discarded (MEDIUM - ~50%)

In `login.tsx:84-86`, the result of `WebBrowser.openAuthSessionAsync()` is not used:
```typescript
await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
// Result containing the redirect URL with auth code is thrown away
```

In a warm-return scenario, `openAuthSessionAsync` resolves with the redirect URL. The code exchange should happen here rather than relying solely on deep link handlers.

### 4. Redirect URI Mismatch (LOW-MEDIUM - ~30%)

`makeRedirectUri({ scheme: "arbitrapay" })` produces `arbitrapay://` (bare scheme, no path). Verify the exact string is in Supabase Dashboard's allowed redirect URLs. Some configurations require a path component.

### 5. Expo Dev Client Deep Link Interference (LOW - ~20%)

Dev client may intercept deep links before app code, potentially stripping query parameters.

**Verification:** Test with a production build via `eas build`.

### 6. `detectSessionInUrl: true` Side Effect (LOW - ~15%)

This setting is designed for web (reads `window.location`). In React Native it may race with manual `exchangeCodeForSession` calls or fail silently.

## Recommended Fix Strategy

The most robust fix: **Capture the result from `openAuthSessionAsync` in `login.tsx` and perform the code exchange there**, rather than relying on deep link handlers. This is the recommended pattern from both Expo and Supabase docs:

```typescript
const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
if (result.type === "success") {
  const url = new URL(result.url);
  const code = url.searchParams.get("code");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
}
```

Keep the deep link handlers in AuthContext as a fallback for cold-start scenarios, but also add robust error logging to identify when the PKCE verifier is missing.
