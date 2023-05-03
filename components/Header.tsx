import styles from '@/styles/Home.module.css'
import useUser from "../hooks/useUser";

const Header = () => {
    const { session, signOut, signInWithGoogle } = useUser();

    return (
        <header>
            <a href="./" className={styles.logo}>Movie Info App</a>
            {session ? (
                <div>
                    <button className={styles.authButton} onClick={() => signOut()}>サインアウト</button>
                </div>
            ) : (
                <button className={styles.authButton} onClick={() => signInWithGoogle()}>Googleでログイン</button>
            )}
        </header>
    );
};

export default Header;
