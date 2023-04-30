import { getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import Head from 'next/head'
import Header from '../components/Header'

const TestAfterAuth = () => {
  return  (
    <>
      <Head>
        <title>After Auth</title>
      </Head>
      <Header />
      <div>Test After Auth</div>
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
