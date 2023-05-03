import styles from '@/styles/Home.module.css'
import useUser from "../hooks/useUser";
import Link from 'next/link';

const Header = () => {
    const { session, signOut, signInWithGoogle } = useUser();

    return (
        <header>
            <Link href="/" className={styles.logo}>Movie Info App</Link>
            {session ? (
                 <button className={styles.authButton} onClick={() => signOut()}>サインアウト</button>
            ) : (
                <button className={styles.authButton} onClick={() => signInWithGoogle()}>Googleでログイン</button>
            )}
        </header>
    );
};

export default Header;
