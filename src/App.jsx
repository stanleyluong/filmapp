import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutPage from './pages/AboutPage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import PopularPeoplePage from './pages/PopularPeoplePage';
import SearchPage from './pages/SearchPage';
import SeasonDetailPage from './pages/SeasonDetailPage';
import TVShowDetailPage from './pages/TVShowDetailPage';
import TopRatedMoviesPage from './pages/TopRatedMoviesPage';
import TopRatedTVShowsPage from './pages/TopRatedTVShowsPage';

// Placeholder Pages
const DiscoverPage = () => <div className="container mx-auto p-4">DiscoverPage - Placeholder</div>;

const theme = createTheme();

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <Helmet>
          <title>FilmApp</title>
        </Helmet>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fb' }}>
          <Navbar />
          <Box
            component="main"
            className="flex-grow container mx-auto px-2 sm:px-4 py-8"
            sx={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '24px 8px',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 2,
              minHeight: 'calc(100vh - 120px)'
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/tv/:id" element={<TVShowDetailPage />} />
              <Route path="/tv/:id/season/:seasonNumber" element={<SeasonDetailPage />} />
              <Route path="/tv/:id/season/:seasonNumber/episode/:episodeNumber" element={<EpisodeDetailPage />} />
              <Route path="/person/:id" element={<PersonDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/top-rated-movies" element={<TopRatedMoviesPage />} />
              <Route path="/top-rated-tv-shows" element={<TopRatedTVShowsPage />} />
              <Route path="/popular-people" element={<PopularPeoplePage />} />
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
