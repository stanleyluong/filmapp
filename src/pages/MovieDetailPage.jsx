import { Avatar, Box, Card, CardMedia, Chip, CircularProgress, Grid, Paper, Rating, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchMovieDetails, fetchMovieWatchProviders } from '../services/tmdbApi';

const CastTable = ({ cast }) => {
  const { getImageUrl } = useTmdbConfig();
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Photo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Character</TableCell>
            <TableCell>Popularity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cast && cast.length > 0 ? cast.map(person => (
            <TableRow
              key={person.cast_id || person.id || person.credit_id}
              hover
              onClick={() => navigate(`/person/${person.id}`)}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <TableCell>
                <Avatar variant="rounded" src={person.profile_path ? getImageUrl(person.profile_path, 'w92') : '/500x750.png'} alt={person.name} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
              </TableCell>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.character}</TableCell>
              <TableCell>{person.popularity ? person.popularity.toFixed(1) : ''}</TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={4} align="center">No cast information available.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TrailersTable = ({ videos }) => {
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Trailer</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Published</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos && videos.length > 0 ? videos.map(video => (
            <TableRow key={video.id} hover>
              <TableCell>
                <a
                  href={`https://www.youtube.com/watch?v=${video.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block' }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/default.jpg`}
                    alt={video.name}
                    style={{ width: 80, height: 45, borderRadius: 4 }}
                  />
                </a>
              </TableCell>
              <TableCell>{video.name}</TableCell>
              <TableCell>{video.type}</TableCell>
              <TableCell>{video.published_at ? new Date(video.published_at).toLocaleDateString() : ''}</TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={4} align="center">No trailers or videos found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RecommendationsTable = ({ recommendations }) => {
  const { getImageUrl } = useTmdbConfig();
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Poster</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Overview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recommendations && recommendations.length > 0 ? recommendations.map(item => {
            const year = item.release_date ? new Date(item.release_date).getFullYear() : '';
            return (
              <TableRow
                key={item.id}
                hover
                onClick={() => navigate(`/movie/${item.id}`)}
                style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <TableCell>
                  <Avatar variant="rounded" src={item.poster_path ? getImageUrl(item.poster_path, 'w92') : '/500x750.png'} alt={item.title} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{year}</TableCell>
                <TableCell>{item.vote_average ? item.vote_average.toFixed(1) : ''}</TableCell>
                <TableCell>{item.overview ? item.overview.substring(0, 100) + (item.overview.length > 100 ? '...' : '') : ''}</TableCell>
              </TableRow>
            );
          }) : (
            <TableRow><TableCell colSpan={5} align="center">No recommendations found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const WhereToWatchTable = ({ providers }) => {
  const providerTypes = [
    { key: 'flatrate', label: 'Stream' },
    { key: 'rent', label: 'Rent' },
    { key: 'buy', label: 'Buy' },
  ];
  let rows = [];
  providerTypes.forEach(type => {
    if (providers?.[type.key]) {
      providers[type.key].forEach(p => {
        rows.push({ name: p.provider_name, type: type.label });
      });
    }
  });
  return (
    <TableContainer component={Paper} sx={{ mb: 2, maxWidth: 400 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Provider Name</TableCell>
            <TableCell>Provider Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? rows.map((row, idx) => (
            <TableRow key={row.name + row.type + idx}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={2} align="center">Not available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MovieDetailPage = () => {
  const { id: movieId } = useParams();
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();
  const [tab, setTab] = useState(0);

  const movieDetailsParams = useMemo(() => ({ 
    movieId,
    appendToResponse: 'credits,videos,recommendations' 
  }), [movieId]);

  const { 
    data: movie, 
    isLoading: movieLoading, 
    error: movieError 
  } = useFetchData(fetchMovieDetails, movieDetailsParams);

  const watchProvidersParams = useMemo(() => ({ movieId }), [movieId]);
  const { data: watchProvidersData } = useFetchData(fetchMovieWatchProviders, watchProvidersParams);

  const isLoading = movieLoading || configLoading;

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }
  if (movieError || configError) {
    return <Box textAlign="center" py={10}><Typography color="error">Error loading movie details: {movieError?.message || configError?.message}</Typography></Box>;
  }
  if (!movie) {
    return <Box textAlign="center" py={10}><Typography>Movie not found.</Typography></Box>;
  }

  const { 
    title, backdrop_path, poster_path, overview, release_date, runtime, 
    vote_average, genres, tagline, credits, videos, recommendations 
  } = movie;

  const year = release_date ? new Date(release_date).getFullYear() : '';
  const posterUrl = poster_path ? getImageUrl(poster_path, 'w500') : '/500x750.png';
  const backdropUrl = backdrop_path ? getImageUrl(backdrop_path, 'original') : null;
  const runtimeFormatted = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A';

  // Where to Watch (US)
  const providers = watchProvidersData?.results?.US;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 180, md: 320 },
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.55)' }} />
        <Grid container columns={12} spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 6 } }}>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 4', lg: 'span 3' }}>
            <Card sx={{ maxWidth: 300, mx: 'auto', boxShadow: 4 }}>
              <CardMedia
                component="img"
                image={posterUrl}
                alt={title}
                sx={{ borderRadius: 2, height: { xs: 180, md: 220 } }}
              />
            </Card>
          </Grid>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 8', lg: 'span 9' }}>
            <Typography variant="h3" fontWeight={700} color="common.white" gutterBottom>
              {title} {year && `(${year})`}
            </Typography>
            {tagline && <Typography variant="h6" color="grey.300" fontStyle="italic" mb={2}>{tagline}</Typography>}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {release_date && <Typography color="grey.200">{new Date(release_date).toLocaleDateString()}</Typography>}
              {runtimeFormatted !== 'N/A' && <Typography color="grey.200">• {runtimeFormatted}</Typography>}
            </Box>
            {genres && genres.length > 0 && (
              <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
                {genres.map(genre => (
                  <Chip key={genre.id} label={genre.name} color="primary" variant="filled" />
                ))}
              </Box>
            )}
            {vote_average > 0 && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating value={vote_average / 2} precision={0.1} readOnly size="large" />
                <Typography color="common.white" fontWeight={600}>{vote_average.toFixed(1)}/10</Typography>
              </Box>
            )}
            <Typography variant="h6" color="common.white" mt={3} mb={1}>Overview</Typography>
            <Typography color="grey.100" mb={3}>{overview || 'No overview available.'}</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Tabs Section */}
      <Box maxWidth="lg" mx="auto" px={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Cast" component="div" />
          <Tab label="Trailers & Videos" component="div" />
          <Tab label="Recommendations" component="div" />
          <Tab label="Where to Watch" component="div" />
        </Tabs>
        {tab === 0 && <CastTable cast={credits?.cast || []} />}
        {tab === 1 && <TrailersTable videos={videos?.results || []} />}
        {tab === 2 && <RecommendationsTable recommendations={recommendations?.results || []} />}
        {tab === 3 && <WhereToWatchTable providers={providers} />}
      </Box>
    </Box>
  );
};

export default MovieDetailPage; 