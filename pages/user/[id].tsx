import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import Head from 'next/head'
import Header from '../../components/Header'
import styles from '@/styles/Home.module.css'
import useUser from '../../hooks/useUser';
import UserInfo from '../../components/UserInfo';
import Setting from '../../components/Setting';
import { getUserInfo } from "../../utils/supabaseFunctions";

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { session } = useUser();
  const [nickname, setNickname] = useState('');
  const [currentComponent, setCurrentComponent] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const data = await getUserInfo(session.user.id);
        if (data && data.nickname) {
          setNickname(data.nickname);
        } else {
          setNickname(session.user.email || '');
        }
      }
    };

    fetchData();
  }, [session]);

  if (!session || !session.user) {
    return <div>Access Denied. Please log in.</div>;
  }
  
  const renderComponent = () => {
    switch (currentComponent) {
      case 'UserInfo':
        return (
          <UserInfo
            id={id as string}
            avatar_url={session.user.user_metadata.avatar_url || ''}
            onNicknameUpdate={setNickname}
          />
        );
      case 'Setting':
        return (
          <Setting
            id={id as string}
            avatar_url={session.user.user_metadata.avatar_url || ''}
            onNicknameUpdate={setNickname}
          />
        );
      default:
        return (
          <div>
            <p className="mb-4">ようこそ, {nickname}!</p>
          </div>
        );
    }
  };

  return (
    <>
      <Head>
      <title>After Auth</title>
      </Head>
      <Header />
      <main className={styles.main}>
        {renderComponent()}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 p-2">
        <div className="flex justify-around">
          <button className="bg-black text-white px-4 py-2 mx-1 rounded">
            Home
          </button>
          <button className="bg-black text-white px-4 py-2 mx-1 rounded">
            Search
          </button>
          <button onClick={() => setCurrentComponent('UserInfo')} className="bg-black text-white px-4 py-2 mx-1 rounded">
            Profile
          </button>
          <button onClick={() => setCurrentComponent('Setting')} className="bg-black text-white px-4 py-2 mx-1 rounded">
            Setting
          </button>
        </div>
      </footer>
    </>
  );
};

export default UserProfile;