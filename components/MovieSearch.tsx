import React, { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { formatDate } from '@/utils/dateUtils'

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  homepage?: string;
}

const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/searchMovies?term=${searchTerm}`);
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className={styles.searchBox}>
            <input
                type="text"
                placeholder="Search for a movie"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />
            <button onClick={searchMovies} className={styles.searchButton}>Search</button>
        </div>
      {loading ? (
        <div className={styles.movieLoading}>Loading...</div>
      ) : (
        <div className={styles.movieList}>
            {movies && movies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
                <img
                    src={
                        movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "/no-image.jpg"
                    }
                    alt={movie.title}
                />
                <h2>{movie.title}</h2>
                <p>{formatDate(movie.release_date)}</p>
            </div>
            ))}
        </div>
      )}
    </>
  );
};

export default MovieSearch;
