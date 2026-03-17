import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string;
  role: "user" | "admin";
  status?: string | null;
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
  const suspendedAlertUserIdRef = useRef<string | null>(null);

  async function handleSuspendedSession(userId: string) {
    if (suspendedAlertUserIdRef.current !== userId) {
      suspendedAlertUserIdRef.current = userId;
      Alert.alert(
        "Account Suspended",
        "Your account has been suspended by the admin. You have been logged out and cannot sign in again."
      );
    }

    setProfile(null);
    setSession(null);
    await supabase.auth.signOut();
  }

  async function fetchOrCreateProfile(userId: string, email?: string | null) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return;
    }

    if (data) {
      if (data.status?.trim().toLowerCase() === "suspended") {
        await handleSuspendedSession(userId);
        return;
      }

      suspendedAlertUserIdRef.current = null;
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
      suspendedAlertUserIdRef.current = null;
      setProfile(newProfile);
    }
  }

  useEffect(() => {

    let mounted = true;

    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        await fetchOrCreateProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    initSession();

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
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    const channel = supabase
      .channel(`profile-status-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`,
        },
        async (payload) => {
          const nextStatus = (payload.new as { status?: string | null }).status;

          if (nextStatus?.trim().toLowerCase() === "suspended") {
            await handleSuspendedSession(session.user.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
