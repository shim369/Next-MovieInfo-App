import { MovieDetails } from '../utils/types';
import styles from "@/styles/MovieItem.module.css";

interface MovieItemProps {
  movie: MovieDetails;
  onOpenModal: () => void;
}

const MovieItem = ({ movie, onOpenModal }: MovieItemProps) => {
  return (
    <div className={styles.movie}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/no-image.jpg"
        }
        alt={movie.title}
        onClick={onOpenModal} // モーダルを開く関数をonClickイベントに追加
      />
      <h4>{movie.title}</h4>
      <p>{movie.release_date}</p>
    </div>
  );
};

export default MovieItem;
