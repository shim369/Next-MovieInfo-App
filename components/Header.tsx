import styles from '@/styles/Home.module.css'
import AuthButton from "./AuthButton"

const Header = () => {
    return (
        <header>
            <a href="./" className={styles.logo}>Movie Info App</a>
            <AuthButton />
        </header>
    );
};

export default Header;
