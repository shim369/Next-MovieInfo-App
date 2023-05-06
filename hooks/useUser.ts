import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

export default function useUser() {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);


  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const VERCEL_URL = process.env.NEXT_PUBLIC_APP_URL;
  const DEV_URL = process.env.NEXT_PUBLIC_APP_URL;
  const currentUrl = process.env.NODE_ENV === 'development' ? DEV_URL : VERCEL_URL;

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (event === "SIGNED_IN") {
        const userId = session?.user?.id;
        if (userId) {
          const origin = window.location.origin || '';
          router.push(`${origin}/user/${userId}`);
        }
      } else if (event === "SIGNED_OUT") {
        if (currentUrl) {
          router.push(currentUrl);
        } else {
          router.push('/');
        }
      }


      // JWT の有効期限をチェックする
      if (session) {
        const decodedToken: { [key: string]: any } = jwt_decode(session.access_token);
        setIsTokenValid(Date.now() < decodedToken.exp * 1000);
      } else {
        setIsTokenValid(null);
      }
      console.log("Is Token Valid:", isTokenValid);


    });

    return () => {
      authListener.subscription.unsubscribe();
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
