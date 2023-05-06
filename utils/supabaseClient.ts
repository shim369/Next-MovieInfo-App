import { useState, useEffect } from "react";
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = (supabase.auth as any).session();

    setUser(session?.user || null);
    setLoading(false);

    const { data: authListener } = (supabase.auth as any).onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []);

  return {
    user,
    loading,
    supabase,
  };
};

export default supabase;
