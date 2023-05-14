import { Movie } from './types'

export const fetchMovies = async (term: string, likedMovies: number[] = []): Promise<Movie[]> => {
  const response = await fetch(`/api/searchMovies?term=${term}&limit=80`);
  const data = await response.json();

  const movies: Movie[] = data.map((movie: Movie) => ({
    ...movie,
    liked: likedMovies.includes(movie.id),
  }));

  return movies;
};