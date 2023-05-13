import React, { useState, useEffect } from "react";
import { addUserInfo, getUserInfo, updateUserInfo, updateAvatar } from "../utils/supabaseFunctions";
import useUser from "../hooks/useUser";
import { getNames, registerLocale } from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";

interface SettingProps {
  id: string;
  avatar_url: string;
  onNicknameUpdate: (nickname: string) => void;
}

export interface UserData {
  nickname: string;
  birthdate: string;
  country: string;
  avatar_url: string;
}

const Setting = ({ id, avatar_url, onNicknameUpdate }: SettingProps) => {
  const [nickname, setNickname] = useState("");
  const [birthdate, setbirthdate] = useState("----/--/--");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(avatar_url || "");
  const [isUser18OrOlder, setIsUser18OrOlder] = useState(false);
  // const [isFormComplete, setIsFormComplete] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

  registerLocale(ja);
  const countries = getNames("ja");

  const { session } = useUser();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setAvatarUrl(avatar_url || "");
  }, [avatar_url]);


  useEffect(() => {
    const fetchUserInfo = async () => {
        const userData = await getUserInfo(id);
        if (userData) {
            setNickname(userData.nickname);
            setbirthdate(userData.birthdate);
            setCountry(userData.country);
        }
    };
    fetchUserInfo();
  }, [id]);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const userData = await getUserInfo(id);
      if (userData && userData.avatar_url) {
        setAvatarUrl(userData.avatar_url);
      }
    };
    fetchAvatarUrl();
  }, [id]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const existingUserInfo = await getUserInfo(id);
        if (existingUserInfo) {
            await updateUserInfo(id, nickname, birthdate, country, avatarUrl);
        } else {
            await addUserInfo(id, nickname, birthdate, country, avatarUrl);
        }
        setIsSubmissionSuccessful(true);
        onNicknameUpdate(nickname);
    } catch (error) {
        setIsSubmissionSuccessful(false);
    }
  };

  const handlebirthdateChange = (e: React.ChangeEvent<HTMLSelectElement>, part: string) => {
    const value = e.target.value;

    const [year, month, day] = birthdate.split("-");
    let newbirthdate = "";

    switch (part) {
      case "year":
        newbirthdate = `${value}-${month}-${day}`;
        break;
      case "month":
        newbirthdate = `${year}-${value}-${day}`;
        break;
      case "day":
        newbirthdate = `${year}-${month}-${value}`;
        break;
    }

    setbirthdate(newbirthdate);
    const birthdateObj = new Date(newbirthdate);
    const currentDate = new Date();
    const ageDifference = currentDate.getTime() - birthdateObj.getTime();
    const age = new Date(ageDifference).getUTCFullYear() - 1970;

    if (age >= 18) {
      setIsUser18OrOlder(true);
    } else {
      setIsUser18OrOlder(false);
    }

    // if (newbirthdate.includes("----") || newbirthdate.includes("--")) {
    //   setIsFormComplete(false);
    // } else {
    //   setIsFormComplete(nickname !== "" && country !== "");
    // }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !session) {
        return;
    }

    const file = e.target.files[0];
    try {
      const newAvatarUrl = await updateAvatar(session.user.id, file);
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
      }
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };


  return (
    <>
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
      <div className="mb-4">
        {avatarUrl ? (
          <img
            src={`${avatarUrl}`}
            alt="User avatar"
            className="rounded-full w-32 h-32 object-cover mx-auto"
          />
        ) : (
          <div className="rounded-full w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center">
            <span className="text-gray-400">No Avatar</span>
          </div>
        )}
        {/* <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="mt-4"
        /> */}
        <div className="file-input-wrapper mt-4">
          <label htmlFor="file-upload" className="file-label">
            画像を選択
          </label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} id="file-upload" className="file-input" />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="nickname" className="mb-2">
        ニックネーム
        </label>
        <input
          type="text"
          onChange={(e) => {
            setNickname(e.target.value);
            // setIsFormComplete(e.target.value !== "" && country !== "" && isUser18OrOlder);
          }}
          value={nickname}
          className="border border-gray-300 p-2 rounded"
        />
        </div>
        <div className="flex flex-col">
          <label htmlFor="birthdate" className="mb-2">
          生年月日
          </label>
          <div className="flex space-x-2">
          <select
            value={birthdate.slice(0, 4)}
            onChange={(e) => handlebirthdateChange(e, "year")}
            className="border border-gray-300 p-2 rounded"
          >
          <option value="----">----</option>
          {Array.from({ length: currentYear - 1900 - 17 }, (_, i) => currentYear - i - 18).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={birthdate.slice(5, 7)}
          onChange={(e) => handlebirthdateChange(e, "month")}
          className="border border-gray-300 p-2 rounded"
        >
        <option value="--">--</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month.toString().padStart(2, "0")}>
            {month}
          </option>
        ))}
        </select>
        <select
          value={birthdate.slice(8)}
          onChange={(e) => handlebirthdateChange(e, "day")}
          className="border border-gray-300 p-2 rounded"
        >
        <option value="--">--</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <option key={day} value={day.toString().padStart(2, "0")}>
            {day}
          </option>
        ))}
        </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="country" className="mb-2">
            居住国
          </label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              // setIsFormComplete(e.target.value !== "" && nickname !== "" && isUser18OrOlder);
            }}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="--">--</option>
            {Object.entries(countries).map(([code, country]) => (
              <option className="truncate max-w-[200px]" key={code} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          // disabled={!isFormComplete}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          設定する
        </button>
        {isSubmissionSuccessful && (
          <div className="text-green-500 mt-4">User info submitted successfully!</div>
        )}
      </form>
    </>
  )
}

export default Setting;