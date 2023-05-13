import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import Head from 'next/head'
import Header from '../../components/Header'
import styles from '@/styles/Home.module.css'
import useUser from '../../hooks/useUser';
import UserInfo from '../../components/UserInfo';
import Setting from '../../components/Setting';
import MovieSearch from '../../components/MovieSearch'
import { getUserInfo } from "../../utils/supabaseFunctions";

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { session, isLoading } = useUser();
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


  useEffect(() => {
    if (!isLoading) {
      document.body.classList.remove("loading");
    } else {
      document.body.classList.add("loading");
    }
  }, [isLoading]);

  if (!session || !session.user) {
    return (
      <div className="text-center p-5">ログインしてください。</div>
    );
  }
  
  const renderComponent = () => {
    switch (currentComponent) {
      case 'MovieSearch':
        return (
          <MovieSearch
          />
        );
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
            <p>ようこそ, {nickname}!</p>
        );
    }
  };

  return (
    <>
      <Head>
      <title>After Auth</title>
      </Head>
      <Header />
      <main className={styles.mainId}>
        {renderComponent()}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-3">
        <div className="flex justify-around">
          <button onClick={() => setCurrentComponent('MovieSearch')}  className="bg-blue-500 text-white px-4 py-2 mx-1 rounded flex items-center justify-center">
          <i className="material-icons">search</i>
          </button>
          <button onClick={() => setCurrentComponent('UserInfo')} className="bg-blue-500 text-white px-4 py-2 mx-1 rounded flex items-center justify-center">
          <i className="material-icons">person</i>
          </button>
          <button onClick={() => setCurrentComponent('Setting')} className="bg-blue-500 text-white px-4 py-2 mx-1 rounded flex items-center justify-center">
          <i className="material-icons">settings</i>
          </button>
        </div>
      </footer>
    </>
  );
};

export default UserProfile;