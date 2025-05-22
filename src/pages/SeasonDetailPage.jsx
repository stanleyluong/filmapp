import { Box, Card, CardMedia, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchSeasonDetails } from '../services/tmdbApi';

const SeasonDetailPage = () => {
  const { id, seasonNumber } = useParams();
  const tvId = id;
  const fetchParams = useMemo(() => ({ tvId, seasonNumber }), [tvId, seasonNumber]);
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();

  const { data: season, isLoading, error } = useFetchData(fetchSeasonDetails, fetchParams);

  if (isLoading || configLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }
  if (error || configError) {
    return <Box textAlign="center" py={10}><Typography color="error">Error loading season details: {error?.message || configError?.message}</Typography></Box>;
  }
  if (!season) {
    return <Box textAlign="center" py={10}><Typography>Season not found.</Typography></Box>;
  }

  const posterUrl = season.poster_path ? getImageUrl(season.poster_path, 'w500') : '/500x750.png';
  const backdropUrl = season.poster_path ? getImageUrl(season.poster_path, 'original') : null;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 220, md: 400 },
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.55)' }} />
        <Grid container columns={12} spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 6 }, py: { xs: 4, md: 8 } }}>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 4', lg: 'span 3' }}>
            <Card sx={{ maxWidth: 300, mx: 'auto', boxShadow: 4 }}>
              <CardMedia
                component="img"
                image={posterUrl}
                alt={season.name}
                sx={{ borderRadius: 2, height: { xs: 340, md: 420 } }}
              />
            </Card>
          </Grid>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 8', lg: 'span 9' }}>
            <Typography variant="h3" fontWeight={700} color="common.white" gutterBottom>
              {season.name}
            </Typography>
            <Typography color="grey.200" mb={2}>{season.air_date ? new Date(season.air_date).toLocaleDateString() : ''}</Typography>
            <Typography color="grey.100" mb={3}>{season.overview || 'No overview available.'}</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Episodes List */}
      <Box maxWidth="lg" mx="auto" px={2}>
        <Typography variant="h5" fontWeight={700} mb={3}>Episodes</Typography>
        <Box maxWidth={700} mx="auto">
          {season.episodes && season.episodes.map(episode => (
            <Paper
              key={episode.id}
              elevation={2}
              component={Link}
              to={`/tv/${tvId}/season/${seasonNumber}/episode/${episode.episode_number}`}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                p: 2,
                gap: 2,
                mb: 2,
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                minHeight: 100,
              }}
            >
              {episode.still_path && (
                <CardMedia
                  component="img"
                  image={getImageUrl(episode.still_path, 'w300')}
                  alt={episode.name}
                  sx={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                />
              )}
              <Box flex={1} minWidth={0}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap>
                  {episode.episode_number}. {episode.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  {episode.air_date ? new Date(episode.air_date).toLocaleDateString() : ''}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {episode.overview || 'No overview available.'}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SeasonDetailPage; 