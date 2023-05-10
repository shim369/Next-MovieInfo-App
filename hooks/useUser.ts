import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

export default function useUser() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const VERCEL_URL = process.env.NEXT_PUBLIC_APP_URL;
  const DEV_URL = process.env.NEXT_PUBLIC_APP_URL;
  const currentUrl = process.env.NODE_ENV === 'development' ? DEV_URL : VERCEL_URL;

  useEffect(() => {
    setIsLoading(false);

    const checkServerStatus = async () => {
      if (currentUrl) {
        try {
          const response = await fetch(currentUrl);
  
          if (!response.ok) {
            supabase.auth.signOut();
          }
        } catch (error) {
          supabase.auth.signOut();
        }
      } else {
        supabase.auth.signOut();
      }
    };
  
    checkServerStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (event === "SIGNED_IN") {
        setIsLoading(true);
        const userId = session?.user?.id;
        if (userId) {
          router.push(`/user/${userId}`).then(() => setIsLoading(false));
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoading(true);
        router.push('/').then(() => setIsLoading(false));
      }

    });

    
    const handleRouteChangeComplete = () => {
      console.log("Route change complete");
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      authListener.subscription.unsubscribe();
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("loading");
    } else {
      document.body.classList.remove("loading");
    }
  }, [isLoading]);

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
    isLoading,
  };
}