import styles from '@/styles/Home.module.css'
import useUser from "../hooks/useUser";
import Link from 'next/link';

const Header = () => {
    const { session, signOut, signInWithGoogle } = useUser();

    const logo = session ? (
      <div className={styles.logo} onClick={(e) => e.preventDefault()}>Movie Info App</div>
    ) : (
      <Link href="/" className={styles.logo}>Movie Info App</Link>
    );

    return (
        <header>
            {logo}
            {session ? (
                <button className={styles.authButton} onClick={() => signOut()}>ログアウト</button>
            ) : (
                <button className={styles.authButton} onClick={() => signInWithGoogle()}>Googleでログイン</button>
            )}
        </header>
    );
};

export default Header;
