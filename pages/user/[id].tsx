import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Header from '../../components/Header'
import styles from '@/styles/Home.module.css'

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

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
                <p>Welcome, {session.user.name}!</p>
            </div>
        </main>
    </>
  );
};

export default UserProfile;