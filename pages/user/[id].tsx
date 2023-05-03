import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../../components/Header'
import styles from '@/styles/Home.module.css'
import useUser from '../../hooks/useUser';

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { session } = useUser();

  if (!session || !session.user) {
    return <div>Access Denied. Please log in.</div>;
  }

  return (
    <>
      <Head>
      <title>After Auth</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div>
        <p>User Id: {id}</p>
        <p>Welcome, {session.user.email || ''}!</p>
        </div>
      </main>
    </>
  );
};

export default UserProfile;