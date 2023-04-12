import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

SwiperCore.use([Pagination, Navigation, Autoplay]);
interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
}
  
interface CarouselProps {
    popularMovies: Movie[];
}
  
const Carousel = ({ popularMovies }: CarouselProps) => {
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop
    >
      {popularMovies.map(movie => (
        <SwiperSlide key={movie.id}>
            <img src={`${IMAGE_BASE_URL}${movie.backdrop_path}`} alt={movie.title} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
