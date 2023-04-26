import { MovieDetails } from './types'

export const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos&language=ja-JP`);
    const data = await response.json();
    console.log(data);
    return data;
};