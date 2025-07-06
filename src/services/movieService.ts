import axios, { type AxiosResponse } from "axios";
import type { Movie } from "../types/movie";

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response: AxiosResponse<{ results: Movie[] }> = await axios.get(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        language: "en-US",
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );

  return response.data.results;
};
