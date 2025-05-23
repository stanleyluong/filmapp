import { Box, Card, CardActionArea, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import {
  fetchPopularMovies,
  fetchPopularTVShows,
  fetchTopRatedMovies,
  fetchTopRatedTVShows,
  fetchTrending,
  fetchUpcomingMovies,
} from '../services/tmdbApi';

const Carousel = ({ title, items, isLoading, error }) => (
  <Box mb={5}>
    <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>
    {isLoading ? (
      <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 1 }}>
        {[...Array(7)].map((_, i) => (
          <Grid key={i} sx={{ minWidth: 180 }}>
            <Skeleton variant="rectangular" width={180} height={270} />
          </Grid>
        ))}
      </Grid>
    ) : error ? (
      <Typography color="error">Error loading items.</Typography>
    ) : (
      <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 1 }}>
        {items?.map(item => (
          <Grid key={item.id} sx={{ minWidth: 180 }}>
            <Card sx={{ width: 180, height: 270, borderRadius: 2, boxShadow: 2 }}>
              <CardActionArea component={Link} to={`/${item.media_type || (item.release_date ? 'movie' : 'tv')}/${item.id}`}>
                <CardMedia
                  component="img"
                  height="270"
                  image={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : '/500x750.png'}
                  alt={item.title || item.name}
                  sx={{ objectFit: 'cover', borderRadius: 2 }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

const HomePage = () => {
  const trendingMoviesParams = useMemo(() => ({ mediaType: 'movie', timeWindow: 'day' }), []);
  const { data: trendingMovies, isLoading: trendingMoviesLoading, error: trendingMoviesError } = 
    useFetchData(fetchTrending, trendingMoviesParams);
  const { getImageUrl } = useTmdbConfig();
  
  const trendingTVParams = useMemo(() => ({ mediaType: 'tv', timeWindow: 'day' }), []);
  const { data: trendingTV, isLoading: trendingTVLoading, error: trendingTVError } = 
    useFetchData(fetchTrending, trendingTVParams);

  const emptyParams = useMemo(() => ({}), []);

  const { data: popularMovies, isLoading: popularMoviesLoading, error: popularMoviesError } = 
    useFetchData(fetchPopularMovies, emptyParams);

  const { data: popularTVShows, isLoading: popularTVShowsLoading, error: popularTVShowsError } = 
    useFetchData(fetchPopularTVShows, emptyParams);

  const { data: topRatedMovies, isLoading: topRatedMoviesLoading, error: topRatedMoviesError } = 
    useFetchData(fetchTopRatedMovies, emptyParams);
    
  const { data: topRatedTVShows, isLoading: topRatedTVShowsLoading, error: topRatedTVShowsError } = 
    useFetchData(fetchTopRatedTVShows, emptyParams);

  const { data: upcomingMovies, isLoading: upcomingMoviesLoading, error: upcomingMoviesError } = 
    useFetchData(fetchUpcomingMovies, emptyParams);

  const heroItem = trendingMovies?.results?.[0];
  const heroImageUrl = heroItem?.backdrop_path ? getImageUrl(heroItem.backdrop_path, 'original') : null;

  return (
    <Box maxWidth="lg" mx="auto" py={4}>
      {/* Movie of the Day Hero Section */}
      {heroItem && heroImageUrl && (
        <Box
          component={Link}
          to={`/movie/${heroItem.id}`}
          aria-label={`Go to details for ${heroItem.title}`}
          sx={{
            mb: 5,
            height: { xs: 220, sm: 320 },
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            borderRadius: 3,
            minHeight: 220,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.45)',
              zIndex: 1,
              borderRadius: 3,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              zIndex: 2,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              p: { xs: 2, sm: 4 },
            }}
          >
            <Typography variant="overline" color="primary.contrastText" fontWeight={700} sx={{ mb: 0.5, bgcolor: 'primary.main', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 14 }}>
              Movie of the Day
            </Typography>
            <Typography variant="h4" color="common.white" fontWeight={700} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
              {heroItem.title}
            </Typography>
          </Box>
        </Box>
      )}
      <Carousel title="Trending Movies Today" items={trendingMovies?.results} isLoading={trendingMoviesLoading} error={trendingMoviesError} />
      <Carousel title="Trending TV Shows Today" items={trendingTV?.results} isLoading={trendingTVLoading} error={trendingTVError} />
      <Carousel title="Popular Movies" items={popularMovies?.results} isLoading={popularMoviesLoading} error={popularMoviesError} />
      <Carousel title="Popular TV Shows" items={popularTVShows?.results} isLoading={popularTVShowsLoading} error={popularTVShowsError} />
      <Carousel title="Upcoming Movies" items={upcomingMovies?.results} isLoading={upcomingMoviesLoading} error={upcomingMoviesError} />
      <Carousel title="Top Rated Movies" items={topRatedMovies?.results} isLoading={topRatedMoviesLoading} error={topRatedMoviesError} />
      <Carousel title="Top Rated TV Shows" items={topRatedTVShows?.results} isLoading={topRatedTVShowsLoading} error={topRatedTVShowsError} />
    </Box>
  );
};

export default HomePage; 