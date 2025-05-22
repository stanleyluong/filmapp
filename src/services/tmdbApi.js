import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.error("VITE_TMDB_API_KEY is not set in .env file. Please add it and restart the development server.");
  // You might want to throw an error here or handle this more gracefully
}

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Function to get API configuration (especially for image base URLs)
export const fetchConfiguration = async () => {
  try {
    const response = await tmdbApi.get('/configuration');
    return response.data;
  } catch (error) {
    console.error('Error fetching API configuration:', error);
    throw error;
  }
};

// Generic data fetching function
const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await tmdbApi.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Specific API call functions
export const fetchTrending = (params) => {
  const { mediaType = 'all', timeWindow = 'week', page = 1 } = params;
  return fetchData(`/trending/${mediaType}/${timeWindow}`, { page });
};

export const fetchPopularMovies = (params) => {
  const { page = 1 } = params;
  return fetchData('/movie/popular', { page });
};

export const fetchPopularTVShows = (params) => {
  const { page = 1 } = params;
  return fetchData('/tv/popular', { page });
};

export const fetchTopRatedMovies = (params) => {
  const { page = 1 } = params;
  return fetchData('/movie/top_rated', { page });
};

export const fetchTopRatedTVShows = (params) => {
  const { page = 1 } = params;
  return fetchData('/tv/top_rated', { page });
};

export const fetchUpcomingMovies = (params) => {
  const { page = 1 } = params;
  return fetchData('/movie/upcoming', { page });
};

export const fetchMovieDetails = (params) => {
  const { movieId, appendToResponse } = params;
  return fetchData(`/movie/${movieId}`, appendToResponse ? { append_to_response: appendToResponse } : {});
};

export const fetchTVShowDetails = (params) => {
  const { tvId, appendToResponse } = params;
  return fetchData(`/tv/${tvId}`, appendToResponse ? { append_to_response: appendToResponse } : {});
};

export const fetchPersonDetails = (params) => {
  const { personId, appendToResponse } = params;
  return fetchData(`/person/${personId}`, appendToResponse ? { append_to_response: appendToResponse } : {});
};

export const fetchMovieCredits = (params) => {
  const { movieId } = params;
  return fetchData(`/movie/${movieId}/credits`);
};

export const fetchTVCredits = (params) => { // For aggregate credits
  const { tvId } = params;
  return fetchData(`/tv/${tvId}/aggregate_credits`);
};

export const fetchPersonCombinedCredits = (params) => {
  const { personId } = params;
  return fetchData(`/person/${personId}/combined_credits`);
};

export const fetchMovieVideos = (params) => {
  const { movieId } = params;
  return fetchData(`/movie/${movieId}/videos`);
};

export const fetchTVVideos = (params) => {
  const { tvId } = params;
  return fetchData(`/tv/${tvId}/videos`);
};

export const fetchMovieRecommendations = (params) => {
  const { movieId, page = 1 } = params;
  return fetchData(`/movie/${movieId}/recommendations`, { page });
};

export const fetchTVRecommendations = (params) => {
  const { tvId, page = 1 } = params;
  return fetchData(`/tv/${tvId}/recommendations`, { page });
};

export const searchMulti = (params) => {
  const { query, page = 1, includeAdult = false } = params;
  return fetchData('/search/multi', { query, page, include_adult: includeAdult });
};

export const searchMovies = (params) => {
  const { query, page = 1, includeAdult = false } = params;
  return fetchData('/search/movie', { query, page, include_adult: includeAdult });
};

export const searchTVShows = (params) => {
  const { query, page = 1, includeAdult = false } = params;
  return fetchData('/search/tv', { query, page, include_adult: includeAdult });
};

export const searchPeople = (params) => {
  const { query, page = 1, includeAdult = false } = params;
  return fetchData('/search/person', { query, page, include_adult: includeAdult });
};

export const discoverMovies = (params = {}) => // params can include sort_by, with_genres, year, etc.
  fetchData('/discover/movie', params);

export const discoverTVShows = (params = {}) =>
  fetchData('/discover/tv', params);

export const fetchGenres = (params) => { // 'movie' or 'tv'
  const { mediaType = 'movie' } = params;
  return fetchData(`/genre/${mediaType}/list`);
};

export const fetchMovieWatchProviders = (params) => {
  const { movieId } = params;
  return fetchData(`/movie/${movieId}/watch/providers`);
};

export const fetchTVWatchProviders = (params) => {
  const { tvId } = params;
  return fetchData(`/tv/${tvId}/watch/providers`);
};

export const fetchSeasonDetails = (params) => {
  const { tvId, seasonNumber } = params;
  return fetchData(`/tv/${tvId}/season/${seasonNumber}`);
};

export const fetchEpisodeDetails = (params) => {
  const { tvId, seasonNumber, episodeNumber, appendToResponse } = params;
  return fetchData(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, appendToResponse ? { append_to_response: appendToResponse } : {});
};

export default tmdbApi; 