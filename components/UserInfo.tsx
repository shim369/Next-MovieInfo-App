import React, { useState, useEffect } from "react";
import { addUserInfo } from "../utils/supabaseFunctions";
import styles from "@/styles/Home.module.css";
// import { supabase } from "../utils/supabaseClient";
import useUser from "../hooks/useUser";

interface UserInfoProps {
  id: string;
  avatar_url: string;
}

const UserInfo = ({ id, avatar_url }: UserInfoProps) => {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(avatar_url || "");
  const { session } = useUser();

  useEffect(() => {
    if (session) {
      const googleProvider = session.user?.app_metadata?.providers?.find(
        (provider: any) => provider === "google"
      );
      if (googleProvider) {
        const googleUserInfo = session.user?.user_metadata?.[googleProvider];
        if (googleUserInfo) {
          setAvatarUrl(googleUserInfo.avatar_url || avatar_url || "");
        }
      }
    }
  }, [avatar_url, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addUserInfo(id, nickname, age, country, avatarUrl);
  };

  return (
    <>
      <div>UserInfo</div>
      <form onSubmit={(e) => handleSubmit(e)} className={styles.userInfoForm}>
        <label htmlFor="">Nickname</label>
        <input
          type="text"
          onChange={(e) => setNickname(e.target.value)}
          value={nickname}
        />
        <label htmlFor="">age</label>
        <input type="text" onChange={(e) => setAge(e.target.value)} value={age} />
        <label htmlFor="">Country</label>
        <input
          type="text"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default UserInfo;