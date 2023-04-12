import styles from '@/styles/Home.module.css'
import type { NextPage, GetServerSideProps } from 'next';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
  
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
  popularMovies: Movie[];
}

const Home: NextPage<HomeProps> = ({ popularMovies }) => {
    return (
      <>
      <Header />
      <Carousel popularMovies={popularMovies} />
      <main className={styles.main}>
        <h1 className="font-inter">Popular Movies</h1>
        <div className={styles.movieList}>
          {popularMovies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
              <img src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`} alt={movie.title} />
              <h2>{movie.title}</h2>
              {movie.homepage && <a href={movie.homepage}>公式サイト</a>}
              <p>{movie.release_date}</p>
              {/* <p>{movie.overview}</p> */}
            </div>
          ))}
        </div>
      </main>
      </>
    );
  };
  
  export const getServerSideProps: GetServerSideProps = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&page=2`);
    const data = await response.json();
    const popularMovies = data.results || [];
  
    return {
      props: {
        popularMovies,
      },
    };
}

export default Home;