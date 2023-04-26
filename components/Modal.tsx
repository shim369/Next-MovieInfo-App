import styles from '@/styles/Home.module.css'
import { MovieDetails, Video } from '@/utils/types'
import { formatDate } from '@/utils/dateUtils'


export interface ModalProps {
  movie: MovieDetails | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ movie, onClose }) => {
  if (!movie) {
    return null;
  }

  const youtubeTrailerUrl = getYoutubeTrailerUrl(movie.videos.results);

  function getYoutubeTrailerUrl(videos: Video[]): string | null {
    const youtubeTrailer = videos.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );
    if (youtubeTrailer) {
      return `https://www.youtube.com/embed/${youtubeTrailer.key}`;
    }
    return null;
  }  

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
        <span className="material-icons">close</span>
        </button>
        <div className={styles.modalContent}>
        {youtubeTrailerUrl ? (
          <iframe
            width="560"
            height="315"
            src={youtubeTrailerUrl}
            title={movie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          ) : (
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                  : "/no-image.jpg"
              }
              alt={movie.title}
            />
          )}
          <div className={styles.modalText}>
            <h2>{movie.title}</h2>
            <p className={styles.modalOverview}>{movie.overview}</p>
            <p>
              ジャンル: {" "}
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p>上映時間: {movie.runtime} 分</p>
            <p>リリース日: {formatDate(movie.release_date)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
