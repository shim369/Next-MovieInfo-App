// import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { addUserInfo } from "../utils/supabaseFunctions"
import styles from '@/styles/Home.module.css'

const UserInfo = () => {
    const [nickname, setNickname] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [country, setCountry] = useState<string>("");


    const handleSubmit = async(e: any) => {
        e.preventDefault();

        if (nickname === "" || age === "" || country === "") return;
        await addUserInfo(nickname,age,country);
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