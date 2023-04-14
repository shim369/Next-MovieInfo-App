import styles from '@/styles/Home.module.css'
import type { NextPage, GetServerSideProps } from 'next'
import Carousel from '../components/Carousel'
import Header from '../components/Header'
import MovieSearch from '../components/MovieSearch'
import { formatDate } from '../utils/dateUtils'
  
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  homepage?: string;
}

interface HomeProps {
  newMovies: Movie[];
  popularMovies: Movie[];
}

const Home: NextPage<HomeProps> = ({ newMovies, popularMovies }) => {
    return (
      <>
      <Header />
      <Carousel newMovies={newMovies} />
      <main className={styles.main}>
        <MovieSearch />
        <section>
        <h1 className="font-inter">New Movies</h1>
        <div className={styles.movieList}>
          {newMovies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
              <img
                src={
                  movie.poster_path
                  ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                  : "/no-image.jpg"
                }
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <p>{formatDate(movie.release_date)}</p>
            </div>
          ))}
        </div>
        </section>
        <section>
        <h1 className="font-inter">Popular Movies</h1>
        <div className={styles.movieList}>
          {popularMovies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
              <img
                src={
                  movie.poster_path
                  ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                  : "/no-image.jpg"
                }
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <p>{formatDate(movie.release_date)}</p>
            </div>
          ))}
        </div>
        </section>
      </main>
      </>
    );
  };
  
  export const getServerSideProps: GetServerSideProps = async () => {
    const response1 = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&page=1`);
    const data1 = await response1.json();
    const newMovies = data1.results || [];

    const response2 = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&page=1`);
    const data2 = await response2.json();
    const popularMovies = data2.results || [];
  
    return {
      props: {
        newMovies,
        popularMovies,
      },
    };
}

export default Home;