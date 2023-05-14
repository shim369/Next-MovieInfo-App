import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { fetchMovies } from '../utils/fetchMovies';
import { fetchMovieDetails } from '../utils/fetchMovieDetails';
import { Movie, MovieDetails } from '../utils/types';
import { likeMovie } from "../utils/supabaseFunctions";
import Modal from './Modal';
import useUser from "../hooks/useUser";

export default function MovieSearch() {
  const { user } = useUser();
  const handleLike = async (movie: Movie) => {
    if (user) {
      await likeMovie(movie, user.id);
    } else {
      console.error("User not found");
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  const uniqueMovies = movies.filter((movie, index, self) =>
    index === self.findIndex((m) => m.id === movie.id)
  );

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
                movie.liked ? 'liked' : ''
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