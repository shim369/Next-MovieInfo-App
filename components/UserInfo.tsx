import React, { useState, useEffect } from "react";
import { getUserInfo, fetchLikedMovies } from "../utils/supabaseFunctions";
import useUser from "../hooks/useUser";
import { fetchMovieDetails } from '../utils/fetchMovieDetails';
import { Movie, MovieDetails } from '../utils/types';
import styles from '@/styles/Home.module.css';
import Modal from './Modal';

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

const UserInfo = ({ onNicknameUpdate }: UserInfoProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
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


  useEffect(() => {
    const fetchMovies = async () => {
      if (session) {
        const movies = await fetchLikedMovies(session.user.id);
        setLikedMovies(movies);
      }
    };

    fetchMovies();
  }, [session]);


  const handleMovieClick = async (id: number) => {
    try {
      const data = await fetchMovieDetails(id);
      setSelectedMovie(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className="flex justify-between flex-col md:flex-row">
        <div className="profile-box flex-grow md:flex-grow-0 md:flex-shrink-0 md:w-1.9/10 bg-white p-5">
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
              <div className="text-center">
                <h3>{userData?.nickname || "Not available"}</h3>
                <h3>{userData?.country || "Not available"}</h3>
                <h3>{userData?.birthdate?.slice(0, 10) || "Not available"}</h3>
              </div>
            </>
          )}
        </div>
        <div className="like-box flex-grow md:flex-grow-0 md:flex-shrink-0 md:w-8/10 bg-white p-5">
          <h2 className="text-lg"><span className="bg-white">お気に入り</span></h2>
          <div className={styles.movieList}>
            {likedMovies.map((movie) => (
              <div key={movie.id} className={`${styles.movieItem} relative`}>
                <img
                  src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                  alt={movie.title}
                  onClick={() => handleMovieClick(movie.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedMovie && (
        <Modal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default UserInfo;