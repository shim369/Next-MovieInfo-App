// import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { addUserInfo } from "../utils/supabaseFunctions"
import styles from '@/styles/Home.module.css'
import { useAuth } from "@/utils/supabaseClient"

interface UserInfoProps {
    id: string;
    avatar_url: string;
}

const UserInfo = ({ id, avatar_url }: UserInfoProps) => {
    const { user } = useAuth();
    const avatarUrl = user?.user_metadata?.avatar_url;
    const [nickname, setNickname] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [country, setCountry] = useState<string>("");


    const handleSubmit = async(e: any) => {
        e.preventDefault();

        if (user.id === "" || nickname === "" || age === "" || country === "" || avatarUrl === "") return;
        await addUserInfo(id, nickname, age, country, avatarUrl);
    };
    
  return (
    <>
        <div>UserInfo</div>
        <form onSubmit={(e) => handleSubmit(e)} className={styles.userInfoForm}>
            <label htmlFor="">Nickname</label>
            <input
                type="text"
                onChange={(e)=> setNickname(e.target.value)}
                value={nickname}
            />
            <label htmlFor="">age</label>
            <input
                type=""
                onChange={(e)=> setAge(e.target.value)}
                value={age}
            />
            <label htmlFor="">Country</label>
            <input
                type="text"
                onChange={(e)=> setCountry(e.target.value)}
                value={country}
            />
            <button type="submit">Submit</button>
        </form>
    </>
  )
}

export default UserInfo