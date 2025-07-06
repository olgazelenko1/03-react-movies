import { useState } from "react";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import styles from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const handleFetchMovies = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
      } else {
        setMovies(results);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Сталася помилка при завантаженні фільмів.");
      toast.error("Сталася помилка при завантаженні фільмів.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <SearchBar onSubmit={handleFetchMovies} />

      {error ? (
        <ErrorMessage />
      ) : loading ? (
        <Loader />
      ) : (
        <>
          <MovieGrid movies={movies} onSelect={handleSelect} />
          {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
