import React, { useState, useEffect } from "react";
import { addUserInfo } from "../utils/supabaseFunctions";
import useUser from "../hooks/useUser";

interface UserInfoProps {
  id: string;
  avatar_url: string;
}

const UserInfo = ({ id, avatar_url }: UserInfoProps) => {
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("----/--/--");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(avatar_url || "");
  const [isUser18OrOlder, setIsUser18OrOlder] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

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
  }, [avatar_url, session]);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addUserInfo(id, nickname, birthDate, country, avatarUrl);
      setIsSubmissionSuccessful(true);
    } catch (error) {
      setIsSubmissionSuccessful(false);
    }
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLSelectElement>, part: string) => {
    const value = e.target.value;

    const [year, month, day] = birthDate.split("-");
    let newBirthDate = "";

    switch (part) {
      case "year":
        newBirthDate = `${value}-${month}-${day}`;
        break;
      case "month":
        newBirthDate = `${year}-${value}-${day}`;
        break;
      case "day":
        newBirthDate = `${year}-${month}-${value}`;
        break;
    }

    setBirthDate(newBirthDate);
    const birthDateObj = new Date(newBirthDate);
    const currentDate = new Date();
    const ageDifference = currentDate.getTime() - birthDateObj.getTime();
    const age = new Date(ageDifference).getUTCFullYear() - 1970;

    if (age >= 18) {
      setIsUser18OrOlder(true);
    } else {
      setIsUser18OrOlder(false);
    }

    if (newBirthDate.includes("----") || newBirthDate.includes("--")) {
      setIsFormComplete(false);
    } else {
      setIsFormComplete(nickname !== "" && country !== "");
    }
    
  };

  return (
    <>
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="nickname" className="mb-2">
          Nickname
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
          <label htmlFor="birthDate" className="mb-2">
            Birth Date
          </label>
          <div className="flex space-x-2">
          <select
            value={birthDate.slice(0, 4)}
            onChange={(e) => handleBirthDateChange(e, "year")}
          >
          <option value="----">----</option>
          {Array.from({ length: currentYear - 1900 - 17 }, (_, i) => currentYear - i - 18).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={birthDate.slice(5, 7)}
          onChange={(e) => handleBirthDateChange(e, "month")}
        >
        <option value="--">--</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month.toString().padStart(2, "0")}>
            {month}
          </option>
        ))}
        </select>
        <select
          value={birthDate.slice(8)}
          onChange={(e) => handleBirthDateChange(e, "day")}
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
            Country
          </label>
          <input
            type="text"
            onChange={(e) => {
              setCountry(e.target.value);
              setIsFormComplete(e.target.value !== "" && nickname !== "" && isUser18OrOlder);
            }}            
            value={country}
            className="border border-gray-300 p-2 rounded"
          />
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