import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/testAfterAuth");
    } else if (status === "loading") {
      return;
    } else {
      router.push("/");
    }
  }, [status, router]);
  
  
  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}