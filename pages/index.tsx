import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css'
import type { NextPage, GetServerSideProps } from 'next'
import Carousel from '../components/Carousel'
import Header from '../components/Header'
import MovieSearch from '../components/MovieSearch'
import { fetchMovieDetails } from '../utils/fetchMovieDetails'
import { MovieDetails } from '../utils/types'
import Modal from '../components/Modal'


interface HomeProps {
  newMovies: MovieDetails[];
  popularMovies: MovieDetails[];
}


// declare global {
//   interface Window {
//     onYouTubeIframeAPIReady?: () => void;
//     YT: any;
//   }
// }


const Home: NextPage<HomeProps> = ({ newMovies, popularMovies }) => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);

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

  // const player = useRef(null);

  // useEffect(() => {
  //   const onYouTubeIframeAPIReady = () => {
  //     if (typeof window.YT !== 'undefined') {
  //       player.current = new window.YT.Player('youtube', {
  //         videoId: 'FoDN_onPpus',
  //         playerVars: {
  //           playsinline: 1,
  //           autoplay: 1,
  //           fs: 0,
  //           rel: 0,
  //           controls: 0,
  //           modestbranding: 1,
  //           iv_load_policy: 3,
  //           start: 50,
  //         },
  //         events: {
  //           onReady: onPlayerReady,
  //           onStateChange: onPlayerStateChange,
  //         },
  //       });
  //     }
  //   };

  //   const onPlayerReady = (event: any) => {
  //     event.target.mute();
  //     event.target.playVideo();
  //   };

  //   const onPlayerStateChange = (event: any) => {
  //     if (event.data === window.YT.PlayerState.ENDED) {
  //       event.target.playVideo();
  //     }
  //   };

  //   const loadYouTubeAPI = () => {
  //     const tag = document.createElement('script');
  //     tag.src = 'https://www.youtube.com/iframe_api';
  //     const firstScriptTag = document.getElementsByTagName('script')[0];
  //     if (firstScriptTag && firstScriptTag.parentNode) {
  //       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  //     }
  //   };

  //   window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  //   loadYouTubeAPI();

  //   return () => {
  //     window.onYouTubeIframeAPIReady = undefined;
  //   };
  // }, []);

    return (
      <>
      <Head>
        <title>Movie Info App</title>
      </Head>
      <Header />
      {/* <div id="youtube-area">
        <div id="youtube"></div>
      </div> */}
      <Carousel newMovies={newMovies} />
      <main className={styles.main}>
        <MovieSearch />
        <section>
        <h1 className="font-inter">新着映画</h1>
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
                onClick={() => handleMovieClick(movie.id)}
                width="324"
                height="486"
              />
            </div>
          ))}
        </div>
        </section>
        <section>
        <h1 className="font-inter">人気映画</h1>
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
                onClick={() => handleMovieClick(movie.id)}
                width="324"
                height="486"
              />
            </div>
          ))}
        </div>
        </section>
      </main>
      <footer>
        ©️ 2023 Movie Info App
      </footer>
      {selectedMovie && (
        <Modal movie={selectedMovie} onClose={handleCloseModal} />
      )}
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