import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from '@/styles/Home.module.css'

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/testAfterAuth");
    } else if (status === "loading") {
      // Loadingの時は何も表示しない
    } else {
      router.push("/");
    }
  }, [status, router]);
  
  
  if (session) {
    return (
      <>
        <button className={styles.authButton} onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  if (status === "loading") {
    return (
      <>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <button className={styles.authButton} onClick={() => signIn()}>Sign in</button>
    </>
  )
}
