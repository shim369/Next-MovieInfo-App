import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchTerm = req.query.term;

  if (!searchTerm) {
    res.status(400).json({ error: 'Missing search term' });
    return;
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&&query=${searchTerm}`
  );
  const data = await response.json();

  res.status(200).json(data.results);
}
