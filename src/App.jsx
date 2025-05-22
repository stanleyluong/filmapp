import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutPage from './pages/AboutPage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import SearchPage from './pages/SearchPage';
import SeasonDetailPage from './pages/SeasonDetailPage';
import TVShowDetailPage from './pages/TVShowDetailPage';

// Placeholder Pages
const DiscoverPage = () => <div className="container mx-auto p-4">DiscoverPage - Placeholder</div>;

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
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
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
