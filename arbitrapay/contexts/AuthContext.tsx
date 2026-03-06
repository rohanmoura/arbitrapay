import { createContext, useContext, useEffect, useState } from "react";
import { Linking } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { extractOAuthParams } from "@/lib/oauth-helpers";

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

    if (!insertError && newProfile) {
      setProfile(newProfile);
    }
  }

  useEffect(() => {
    console.log("APP STARTED");

    let mounted = true;

    /**
     * Handle an OAuth redirect URL by extracting the authorization code
     * and exchanging it for a Supabase session. This covers the Android
     * cold-start case where the app was killed while the browser was open
     * and is relaunched via the deep link.
     */
    const handleOAuthRedirect = async (url: string | null) => {
      if (!url) return false;

      const params = extractOAuthParams(url);
      if (!params.code) return false;

      console.log("OAuth redirect detected, exchanging code for session");
      const { error } = await supabase.auth.exchangeCodeForSession(
        params.code
      );
      if (error) {
        console.log("OAuth code exchange error:", error.message);
      }
      // Whether success or failure, we handled the redirect
      return true;
    };

    const initSession = async () => {
      // Check if the app was launched via an OAuth redirect (cold-start)
      const initialUrl = await Linking.getInitialURL();
      await handleOAuthRedirect(initialUrl);

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

    initSession();

    // Listen for deep links while the app is running (warm-start)
    const linkingSub = Linking.addEventListener("url", async ({ url }) => {
      await handleOAuthRedirect(url);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
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
      authListener.subscription.unsubscribe();
      linkingSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);