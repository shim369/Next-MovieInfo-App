import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import type { NextPage, GetServerSideProps } from 'next';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })
  
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface HomeProps {
  popularMovies: Movie[];
}


const Home: NextPage<HomeProps> = ({ popularMovies }) => {
    const [movies, setMovies] = useState<Movie[]>(popularMovies);
  
    return (
      <main className={styles.main}>
        <h1 className={inter.className}>Popular Movies</h1>
        <div className={styles.movieList}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
              <img src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`} alt={movie.title} />
              <h2>{movie.title}</h2>
              {/* <p>{movie.overview}</p> */}
            </div>
          ))}
        </div>
      </main>
    );
  };
  
  export const getServerSideProps: GetServerSideProps = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`);
    const data = await response.json();
    const popularMovies = data.results;
  
    return {
      props: {
        popularMovies,
      },
    };
}

export default Home