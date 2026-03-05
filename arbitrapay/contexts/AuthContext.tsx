import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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

    // Profile doesn't exist yet — create it
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
    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user) {
        await fetchOrCreateProfile(session.user.id, session.user.email);
      }

      setLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only act on meaningful auth events
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "SIGNED_OUT"
      ) {
        setSession(session);

        if (session?.user) {
          await fetchOrCreateProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);