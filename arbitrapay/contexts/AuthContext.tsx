import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { setSessionFromUrl } from "@/lib/supabase-session-from-url";
import {
  getCapturedOAuthUrl,
  clearCapturedOAuthUrl,
  onOAuthRedirect,
} from "@/lib/oauth-redirect-handler";

type Profile = {
  id: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  loading: true,
});

function isOAuthUrl(url: string): boolean {
  return (
    url.includes("code=") ||
    url.includes("access_token=") ||
    url.includes("refresh_token=")
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchOrCreateProfile(userId: string, email?: string | null) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.log("Profile fetch error:", error);
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data);
      return;
    }

    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
      })
      .select()
      .single();

    if (!insertError) {
      setProfile(newProfile);
    }
  }

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      // STEP 1: Check if we have a captured OAuth redirect URL
      // This catches URLs from both cold start (getInitialURL) and
      // warm start (addEventListener) that were captured at module level
      // BEFORE React mounted.
      const capturedUrl = getCapturedOAuthUrl();
      if (capturedUrl && isOAuthUrl(capturedUrl)) {
        console.log("PROCESSING CAPTURED OAUTH URL:", capturedUrl);
        clearCapturedOAuthUrl();
        await setSessionFromUrl(capturedUrl);
      }

      // STEP 2: Now check the session (which may have been set by step 1)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("INITIAL SESSION:", session);

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        await fetchOrCreateProfile(session.user.id, session.user.email);
      }

      setLoading(false);
    };

    initialize();

    // STEP 3: Listen for deep link URLs that arrive AFTER initialization
    // (e.g., when the app is already open and the browser redirects back)
    const unsubscribeRedirect = onOAuthRedirect(async (url) => {
      if (!mounted) return;
      if (isOAuthUrl(url)) {
        console.log("PROCESSING LIVE OAUTH REDIRECT:", url);
        clearCapturedOAuthUrl();
        await setSessionFromUrl(url);
      }
    });

    // STEP 4: Listen for Supabase auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);

        if (session?.user) {
          await fetchOrCreateProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribeRedirect();
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
