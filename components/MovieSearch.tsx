import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { formatDate } from '@/utils/dateUtils';
import { fetchMovies } from '../utils/fetchMovies';
import { fetchMovieDetails } from '../utils/fetchMovieDetails';
import { Movie, MovieDetails } from '../utils/types';
import Modal from './Modal';

const MovieSearch: React.FC = () => {
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

  return (
    <>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="映画情報を検索する"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchMovies();
            }
          }}
        />
        <button onClick={searchMovies} className={styles.searchButton}>検索</button>
      </div>
      {loading ? (
        <div className={styles.movieLoading}>検索中...</div>
      ) : movies.length > 0 ? (
        <section>
        <h1 className="font-inter">検索結果</h1>
        <div className={styles.movieList}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "/no-image.jpg"
                }
                alt={movie.title}
                onClick={() => handleMovieClick(movie.id)}
              />
              {/* <h2>{movie.title}</h2>
              <p>{formatDate(movie.release_date)}</p>
              <button onClick={() => handleMovieClick(movie.id)}>詳細情報</button> */}
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

export default MovieSearch;