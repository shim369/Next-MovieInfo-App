import { useRouter } from 'next/router'
import React, { useState } from "react";
import Head from 'next/head'
import Header from '../../components/Header'
import styles from '@/styles/Home.module.css'
import useUser from '../../hooks/useUser';
import UserInfo from '../../components/UserInfo';

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { session } = useUser();
  const [nickname, setNickname] = useState(session ? session.user.user_metadata.nickname || '' : '');

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
        <p className="mb-4">ようこそ, {nickname ? nickname : session.user.email || ''}!</p>

        {/* <p className="mb-4">User Id: {id}</p> */}
        <UserInfo
          id={id as string}
          avatar_url={session.user.user_metadata.avatar_url || ''}
          onNicknameUpdate={setNickname}
        />
        </div>
      </main>
    </>
  );
};

export default UserProfile;