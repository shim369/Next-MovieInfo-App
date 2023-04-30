import { getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import Head from 'next/head'
import Header from '../components/Header'
import styles from '@/styles/Home.module.css'

const TestAfterAuth = () => {
  return  (
    <>
      <Head>
        <title>After Auth</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div>Test After Auth</div>
      </main>
    </>
  )
};

export default TestAfterAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
