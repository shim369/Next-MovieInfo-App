import React, { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { fetchMovies } from '../utils/fetchMovies';
import { fetchMovieDetails } from '../utils/fetchMovieDetails';
import { Movie, MovieDetails } from '../utils/types';
import { likeMovie, unlikeMovie, fetchLikedMovieIds } from "../utils/supabaseFunctions";
import Modal from './Modal';
import useUser from "../hooks/useUser";

export default function MovieSearch() {
  const { user } = useUser();
  const isMovieLiked = (movieId: number) => {
    return likedMovieIds.includes(movieId);
  };
  const handleLike = async (movie: Movie) => {
    if (user) {
      if (isMovieLiked(movie.id)) {
        // if movie is already liked, unlike it
        await unlikeMovie(movie, user.id);
        setLikedMovieIds(likedMovieIds.filter(id => id !== movie.id));
      } else {
        // if movie is not liked yet, like it
        await likeMovie(movie, user.id);
        setLikedMovieIds([...likedMovieIds, movie.id]);
      }
    } else {
      console.error("User not found");
    }
  };  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [likedMovieIds, setLikedMovieIds] = useState<number[]>([]);

  const fetchLikedMovies = async () => {
    if (user) {
      const likedIds = await fetchLikedMovieIds(user.id);
      setLikedMovieIds(likedIds);
    }
  };

  useEffect(() => {
    fetchLikedMovies();
  }, [user]);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies(searchTerm);
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearchTerm('');
      setHasSearched(true);
    }
  };

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

  const uniqueMovies = movies.map((movie) => ({
    ...movie,
    liked: likedMovieIds.includes(movie.id),
  }));

  return (
    <>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="映画情報を検索する"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${styles.searchInput} border border-gray-300`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchMovies();
            }
          }}
        />
        <button onClick={searchMovies} className={styles.searchButton}><i className="material-icons">search</i></button>
      </div>
      {loading ? (
        <div className={styles.movieLoading}>検索中...</div>
      ) : uniqueMovies.length > 0 ? (
        <section>
        <h2 className="text-lg"><span>検索結果</span></h2>
        <div className={styles.movieList}>
          {uniqueMovies.map((movie) => (
          <div key={movie.id} className={`${styles.movieItem} relative`}>
            <img
              src={
                movie.poster_path && movie.poster_path !== 'null' && movie.poster_path.trim() !== ''
                  ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                  : "/no-image.jpg"
              }
              alt={movie.title}
              onClick={() => handleMovieClick(movie.id)}
              width="324"
              height="486"
            />
            <button
              onClick={() => handleLike(movie)}
              className={`${styles.movieItemButton} flex items-center justify-center w-6 h-6 absolute top-0 right-0 ${
                isMovieLiked(movie.id) ? 'text-red-500' : 'text-gray-200'
              }`}
            >
              <i className="material-icons p-2 text-sm">favorite</i>
            </button>
          </div>
        ))}
        </div>
        </section>
      ) : (
        hasSearched && <div className={styles.movieNothing}>検索結果なし</div>
      )}
      {selectedMovie && (
        <Modal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
};
