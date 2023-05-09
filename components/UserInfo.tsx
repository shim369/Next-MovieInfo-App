import React, { useState, useEffect } from "react";
import { addUserInfo, getUserInfo } from "../utils/supabaseFunctions";
import useUser from "../hooks/useUser";
import { getNames, registerLocale } from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";

interface UserInfoProps {
  id: string;
  avatar_url: string;
  onNicknameUpdate: (nickname: string) => void;
}

export interface UserData {
  nickname: string;
  birthdate: string;
  country: string;
}

const UserInfo = ({ id, avatar_url, onNicknameUpdate }: UserInfoProps) => {
  const [nickname, setNickname] = useState("");
  const [birthdate, setbirthdate] = useState("----/--/--");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(avatar_url || "");
  const [isUser18OrOlder, setIsUser18OrOlder] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  registerLocale(ja);
  const countries = getNames("ja");
  
  const { session } = useUser();
  const currentYear = new Date().getFullYear();

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

    const fetchData = async () => {
      if (session) {
        const data = await getUserInfo(session.user.id);
        if (data) {
          setUserData(data);
          if (data.nickname) {
            onNicknameUpdate(data.nickname);
          }
        }
      }
    };

    fetchData();
  }, [avatar_url, session]);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addUserInfo(id, nickname, birthdate, country, avatarUrl);
      setIsSubmissionSuccessful(true);
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

    if (newbirthdate.includes("----") || newbirthdate.includes("--")) {
      setIsFormComplete(false);
    } else {
      setIsFormComplete(nickname !== "" && country !== "");
    }
    
  };

  return (
    <>
    <div className="mb-4">
      {userData && (
        <>
          <h3>ニックネーム: {userData?.nickname || "Not available"}</h3>
          <h3>生年月日: {userData?.birthdate?.slice(0, 10) || "Not available"}</h3>
          <h3>国籍: {userData?.country || "Not available"}</h3>
        </>
      )}
    </div>
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="nickname" className="mb-2">
        ニックネーム
        </label>
        <input
          type="text"
          onChange={(e) => {
            setNickname(e.target.value);
            setIsFormComplete(e.target.value !== "" && country !== "" && isUser18OrOlder);
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
            国籍
          </label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setIsFormComplete(e.target.value !== "" && nickname !== "" && isUser18OrOlder);
            }}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="--">--</option>
            {Object.entries(countries).map(([code, country]) => (
              <option key={code} value={country}>
                {country}
              </option>
            ))}
          </select>
          {/* <input
            type="text"
            onChange={(e) => {
              setCountry(e.target.value);
              setIsFormComplete(e.target.value !== "" && nickname !== "" && isUser18OrOlder);
            }}            
            value={country}
            className="border border-gray-300 p-2 rounded"
          /> */}
        </div>
        <button
          type="submit"
          disabled={!isFormComplete}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Submit
        </button>
        {isSubmissionSuccessful && (
          <div className="text-green-500 mt-4">User info submitted successfully!</div>
        )}
      </form>
    </>
  );
};

export default UserInfo;