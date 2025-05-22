import { Box, Card, CardMedia, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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
                alt={season.name}
                sx={{ borderRadius: 2, height: { xs: 180, md: 220 } }}
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
      {/* Episodes Table */}
      <Box maxWidth="lg" mx="auto" px={2}>
        <Typography variant="h5" fontWeight={700} mb={3}>Episodes</Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 900, mx: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Runtime</TableCell>
                <TableCell>Vote Average</TableCell>
                <TableCell>Vote Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {season.episodes && season.episodes.length > 0 ? season.episodes.map(episode => (
                <TableRow
                  key={episode.id}
                  hover
                  component={Link}
                  to={`/tv/${tvId}/season/${seasonNumber}/episode/${episode.episode_number}`}
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <TableCell>
                    <img
                      src={episode.still_path ? getImageUrl(episode.still_path, 'w300') : '/500x750.png'}
                      alt={episode.name}
                      style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell>{episode.episode_number}. {episode.name}</TableCell>
                  <TableCell>{episode.air_date ? new Date(episode.air_date).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{episode.overview || 'No overview available.'}</TableCell>
                  <TableCell>{episode.runtime ? `${episode.runtime} min` : 'N/A'}</TableCell>
                  <TableCell>{episode.vote_average ? episode.vote_average.toFixed(1) : 'N/A'}</TableCell>
                  <TableCell>{episode.vote_count ?? 'N/A'}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={3} align="center">No episodes available.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SeasonDetailPage; 