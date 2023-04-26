import type { NextApiRequest, NextApiResponse } from 'next';
import { Movie } from '../../utils/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchTerm = req.query.term;
  const limit = req.query.limit as string;

  if (!searchTerm) {
    res.status(400).json({ error: 'Missing search term' });
    return;
  }

  const fetchMoviesPage = async (page: number): Promise<Movie[]> => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&query=${searchTerm}&page=${page}`
    );
    const data = await response.json();

    if (data.results) {
      return data.results.map((movie: any) => {
        return {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
          original_language: movie.original_language,
          original_title: movie.original_title,
          backdrop_path: movie.backdrop_path,
          genre_ids: movie.genre_ids,
        };
      });
    } else {
      return [];
    }
  };

  const totalPages = Math.ceil(Number(limit) / 20);
  const movies: Movie[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const pageResults = await fetchMoviesPage(i);
    movies.push(...pageResults);
  }

  const limitedMovies = movies.slice(0, Number(limit));

  res.status(200).json(limitedMovies);
}
