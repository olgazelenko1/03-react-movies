import { useState } from "react";
import axios, { type AxiosResponse } from "axios";
import type { Movie } from "../types/movie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader/Loader";
import MovieGrid from "./MovieGrid/MovieGrid";
import SearchBar from "./SearchBar/SearchBar";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import MovieModal from "./MovieModal/MovieModal";
import styles from "./App.module.css";

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const fetchMovies = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const response: AxiosResponse<{ results: Movie[] }> = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: { query, language: "en-US", include_adult: false },
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }
      );

      if (response.data.results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
      } else {
        setMovies(response.data.results);
      }
    } catch {
      setError("Сталася помилка при завантаженні фільмів.");
      toast.error("Сталася помилка при завантаженні фільмів.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <SearchBar onSubmit={fetchMovies} />

      {error ? (
        <ErrorMessage />
      ) : loading ? (
        <Loader />
      ) : (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
