import { Movie } from './types'

export const fetchMovies = async (term: string): Promise<Movie[]> => {
  const response = await fetch(`/api/searchMovies?term=${term}&limit=80`);
  const data = await response.json();
  return data;
};

