export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    original_title: string;
    backdrop_path: string;
    genre_ids: number[];
    homepage?: string;
    liked: boolean;
  }
  
  export interface Cast {
    character: string;
    id: number;
    name: string;
    profile_path: string;
  }
  
  export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }
  
  export interface MovieDetails {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: {
      id: number;
      name: string;
      poster_path: string;
      backdrop_path: string;
    } | null;
    budget: number;
    genres: {
      id: number;
      name: string;
    }[];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: {
      id: number;
      logo_path: string | null;
      name: string;
      origin_country: string;
    }[];
    production_countries: {
      iso_3166_1: string;
      name: string;
    }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: {
      english_name: string;
      iso_639_1: string;
      name: string;
    }[];
    status: string;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    videos: {
      results: Video[];
    };
    credits: {
      cast: Cast[];
    };
  }