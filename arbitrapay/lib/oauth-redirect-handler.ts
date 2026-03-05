import * as Linking from "expo-linking";

/**
 * Module-level deep link capture.
 *
 * This runs IMMEDIATELY when the JS bundle loads — before any React component
 * mounts or useEffect fires. This is critical because on Android, when the
 * OAuth redirect brings the app back, the JS context may restart (Metro reload
 * or process restart). By the time React components mount and register their
 * Linking.addEventListener, the deep link URL event has already fired and is lost.
 *
 * By capturing at the module level, we grab the URL before anything else runs.
 */

let capturedUrl: string | null = null;
let urlListeners: Array<(url: string) => void> = [];

// Capture deep link URLs as soon as this module loads
const subscription = Linking.addEventListener("url", ({ url }) => {
  console.log("MODULE LEVEL DEEP LINK:", url);
  capturedUrl = url;
  // Notify any registered listeners
  urlListeners.forEach((listener) => listener(url));
});

// Also capture the initial URL (for cold starts)
Linking.getInitialURL().then((url) => {
  if (url) {
    console.log("MODULE LEVEL INITIAL URL:", url);
    capturedUrl = url;
    urlListeners.forEach((listener) => listener(url));
  }
});

/**
 * Get the captured OAuth redirect URL (if any).
 * Returns null if no OAuth redirect URL has been captured.
 */
export function getCapturedOAuthUrl(): string | null {
  return capturedUrl;
}

/**
 * Clear the captured URL after it has been processed.
 */
export function clearCapturedOAuthUrl(): void {
  capturedUrl = null;
}

/**
 * Register a listener for future deep link URLs.
 * Returns an unsubscribe function.
 */
export function onOAuthRedirect(
  listener: (url: string) => void
): () => void {
  urlListeners.push(listener);
  return () => {
    urlListeners = urlListeners.filter((l) => l !== listener);
  };
}
