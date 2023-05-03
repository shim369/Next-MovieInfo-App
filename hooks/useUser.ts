import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

export default function useUser() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
  
      if (event === "SIGNED_IN") {
        const userId = session?.user?.id;
        if (userId) {
          router.push(`/user/${userId}`);
        }
      }
    });
  
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  
    if (error) {
      console.error("Error signing in with Google:", error);
      return;
    }
  
  }
  
  
  
  
  
  

  function signOut() {
    supabase.auth.signOut();
  }

  return {
    session,
    user,
    signInWithGoogle,
    signOut,
  };
}
