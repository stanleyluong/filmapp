import { Avatar, Box, CardMedia, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchEpisodeDetails } from '../services/tmdbApi';

const EpisodeDetailPage = () => {
  const { id, seasonNumber, episodeNumber } = useParams();
  const tvId = id;
  const fetchParams = useMemo(() => ({ tvId, seasonNumber, episodeNumber }), [tvId, seasonNumber, episodeNumber]);
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();

  const { data: episode, isLoading, error } = useFetchData(fetchEpisodeDetails, fetchParams);

  if (isLoading || configLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }
  if (error || configError) {
    return <Box textAlign="center" py={10}><Typography color="error">Error loading episode details: {error?.message || configError?.message}</Typography></Box>;
  }
  if (!episode) {
    return <Box textAlign="center" py={10}><Typography>Episode not found.</Typography></Box>;
  }

  const stillUrl = episode.still_path ? getImageUrl(episode.still_path, 'w780') : '/500x750.png';

  return (
    <Box maxWidth="lg" mx="auto" py={6} px={2}>
      <Paper elevation={3} sx={{ mb: 6, p: { xs: 2, md: 4 } }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={stillUrl}
              alt={episode.name}
              sx={{ borderRadius: 2, width: '100%', maxWidth: 400, height: 240, objectFit: 'cover', mx: 'auto', boxShadow: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight={700} mb={1}>{episode.episode_number}. {episode.name}</Typography>
            <Typography color="text.secondary" mb={2}>{episode.air_date ? new Date(episode.air_date).toLocaleDateString() : ''}</Typography>
            <Typography mb={2}>{episode.overview || 'No overview available.'}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>Runtime: {episode.runtime ? `${episode.runtime} min` : 'N/A'}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>Vote Average: {episode.vote_average ? episode.vote_average.toFixed(1) : 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>
      {/* Crew */}
      {episode.crew && episode.crew.length > 0 && (
        <Box mb={5}>
          <Typography variant="h6" fontWeight={700} mb={2}>Crew</Typography>
          <Grid container spacing={2}>
            {episode.crew.map(person => (
              <Grid item key={person.credit_id} xs={6} sm={4} md={3} lg={2}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar
                    src={person.profile_path ? getImageUrl(person.profile_path, 'w185') : undefined}
                    alt={person.name}
                    sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                  />
                  <Typography variant="subtitle2" fontWeight={600}>{person.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{person.job}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* Guest Stars */}
      {episode.guest_stars && episode.guest_stars.length > 0 && (
        <Box mb={5}>
          <Typography variant="h6" fontWeight={700} mb={2}>Guest Stars</Typography>
          <Grid container spacing={2}>
            {episode.guest_stars.map(person => (
              <Grid item key={person.credit_id} xs={6} sm={4} md={3} lg={2}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar
                    src={person.profile_path ? getImageUrl(person.profile_path, 'w185') : undefined}
                    alt={person.name}
                    sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                  />
                  <Typography variant="subtitle2" fontWeight={600}>{person.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{person.character}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default EpisodeDetailPage; 