import { Avatar, Box, CardMedia, CircularProgress, Grid, Paper, Rating, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchEpisodeDetails } from '../services/tmdbApi';

const EpisodeDetailPage = () => {
  const { id, seasonNumber, episodeNumber } = useParams();
  const tvId = id;
  const fetchParams = useMemo(() => ({ tvId, seasonNumber, episodeNumber, appendToResponse: 'credits' }), [tvId, seasonNumber, episodeNumber]);
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();

  const { data: episode, isLoading, error } = useFetchData(fetchEpisodeDetails, fetchParams);

  const [tab, setTab] = useState(0);

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
  const backdropUrl = episode.still_path ? getImageUrl(episode.still_path, 'original') : null;

  // Use credits if present
  const cast = episode.credits?.cast || episode.cast;
  const crew = episode.credits?.crew || episode.crew;
  const guest_stars = episode.credits?.guest_stars || episode.guest_stars;

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
            <CardMedia
              component="img"
              image={stillUrl}
              alt={episode.name}
              sx={{ borderRadius: 2, height: { xs: 180, md: 220 }, width: '100%', maxWidth: 400, objectFit: 'cover', mx: 'auto', boxShadow: 2 }}
            />
          </Grid>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 8', lg: 'span 9' }}>
            <Typography variant="h3" fontWeight={700} color="common.white" gutterBottom>
              {episode.episode_number}. {episode.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
              {episode.air_date && <Typography color="grey.200">Aired: {new Date(episode.air_date).toLocaleDateString()}</Typography>}
              {episode.runtime && <Typography color="grey.200">• {episode.runtime} min</Typography>}
            </Box>
            {episode.vote_average > 0 && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating value={episode.vote_average / 2} precision={0.1} readOnly size="large" />
                <Typography color="common.white" fontWeight={600}>{episode.vote_average.toFixed(1)}/10</Typography>
                {episode.vote_count > 0 && (
                  <Typography color="grey.300" ml={1}>({episode.vote_count} votes)</Typography>
                )}
              </Box>
            )}
            <Typography variant="h6" color="common.white" mt={3} mb={1}>Overview</Typography>
            <Typography color="grey.100" mb={3}>{episode.overview || 'No overview available.'}</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Tabs Section for Cast, Crew, Guest Stars */}
      <Box maxWidth="lg" mx="auto" px={2}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 3 }}
        >
          <Tab label={`Cast (${cast?.length || 0})`} component="div" />
          <Tab label={`Crew (${crew?.length || 0})`} component="div" />
          <Tab label={`Guest Stars (${guest_stars?.length || 0})`} component="div" />
        </Tabs>
        {tab === 0 && (
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
                  <TableRow key={person.cast_id || person.id || person.credit_id} hover>
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
        )}
        {tab === 1 && (
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Job</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Popularity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {crew && crew.length > 0 ? crew.map(person => (
                  <TableRow key={person.credit_id || person.id} hover>
                    <TableCell>
                      <Avatar variant="rounded" src={person.profile_path ? getImageUrl(person.profile_path, 'w92') : '/500x750.png'} alt={person.name} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
                    </TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.job}</TableCell>
                    <TableCell>{person.department}</TableCell>
                    <TableCell>{person.popularity ? person.popularity.toFixed(1) : ''}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} align="center">No crew information available.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 2 && (
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
                {guest_stars && guest_stars.length > 0 ? guest_stars.map(person => (
                  <TableRow key={person.credit_id || person.id} hover>
                    <TableCell>
                      <Avatar variant="rounded" src={person.profile_path ? getImageUrl(person.profile_path, 'w92') : '/500x750.png'} alt={person.name} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
                    </TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.character}</TableCell>
                    <TableCell>{person.popularity ? person.popularity.toFixed(1) : ''}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={4} align="center">No guest stars information available.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default EpisodeDetailPage; 