import React, { useState, useEffect } from "react";
import { getUserInfo } from "../utils/supabaseFunctions";
import useUser from "../hooks/useUser";

interface UserInfoProps {
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

const UserInfo = ({ id, avatar_url, onNicknameUpdate }: UserInfoProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);


  const { session } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const data = await getUserInfo(session.user.id);
        if (data) {
          setUserData(data);
          setAvatarUrl(data.avatar_url);
          if (data.nickname) {
            onNicknameUpdate(data.nickname);
          }
        }
      }
    };

    fetchData();
  }, [session]);

  return (
    <>
      <div className="mb-3">
        {userData?.avatar_url ? (
          <img
            src={`${avatarUrl}`}
            alt="User avatar"
            className="rounded-full w-32 h-32 bg-gray-200 object-cover mx-auto mb-2"
          />
        ) : (
          <div className="rounded-full w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center">
            <span className="text-gray-400">No Avatar</span>
          </div>
        )}
        {userData && (
          <>
            <h3>ニックネーム: {userData?.nickname || "Not available"}</h3>
            <h3>生年月日: {userData?.birthdate?.slice(0, 10) || "Not available"}</h3>
            <h3>居住国: {userData?.country || "Not available"}</h3>
          </>
        )}
      </div>
    </>
  );
};

export default UserInfo;