import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import PlaceholderPerson from '../assets/placeholder-person.svg';
import FilmographyTable from '../components/FilmographyTable';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchPersonCombinedCredits, fetchPersonDetails } from '../services/tmdbApi';

const PersonDetailPage = () => {
  const { id: personId } = useParams();
  const { getImageUrl } = useTmdbConfig();

  const emptyParams = useMemo(() => ({}), []);

  const fetchPersonDetailsCallback = useCallback(() => {
    return personId ? fetchPersonDetails({ personId }) : null;
  }, [personId]);

  const { 
    data: person, 
    loading: personLoading, 
    error: personError 
  } = useFetchData(fetchPersonDetailsCallback, emptyParams);

  const fetchPersonCombinedCreditsCallback = useCallback(() => {
    return personId ? fetchPersonCombinedCredits({ personId }) : null;
  }, [personId]);

  const { 
    data: credits, 
    loading: creditsLoading, 
    error: creditsError 
  } = useFetchData(fetchPersonCombinedCreditsCallback, emptyParams);

  // Separate movies and TV shows from combined credits
  const dedupeById = arr => Object.values(
    (arr || []).reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {})
  );
  const movies = dedupeById(credits?.cast?.filter(item => item.media_type === 'movie'));
  const tvShows = dedupeById(credits?.cast?.filter(item => item.media_type === 'tv'));

  if (!personId) {
    return (
      <Box maxWidth="md" mx="auto" py={8} px={2} textAlign="center">
        <Typography color="text.secondary">Invalid person ID. Please check the URL and try again.</Typography>
      </Box>
    );
  }

  if (personLoading || creditsLoading) {
    return (
      <Box maxWidth="md" mx="auto" py={8} px={2}>
        <Grid container columns={12} spacing={4} alignItems="flex-start">
          <Grid gridColumn={{ xs: 'span 12', md: 'span 4' }}>
            <Skeleton variant="rectangular" width="100%" height={340} sx={{ borderRadius: 3, mb: 2 }} />
          </Grid>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 8' }}>
            <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (personError || creditsError) {
    return (
      <Box maxWidth="md" mx="auto" py={8} px={2} textAlign="center">
        <Typography color="error">Error loading person details. Please try again later.</Typography>
      </Box>
    );
  }

  if (!person) {
    return (
      <Box maxWidth="md" mx="auto" py={8} px={2} textAlign="center">
        <Typography color="text.secondary">Person not found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Helmet>
        <title>{person?.name ? `${person.name} - FilmApp` : 'FilmApp'}</title>
      </Helmet>
      <Box maxWidth="lg" mx="auto" py={6} px={2}>
        {/* Hero Section */}
        <Grid container columns={12} spacing={6} alignItems="flex-start" mb={6}>
          {/* Profile Image */}
          <Grid gridColumn={{ xs: 'span 12', md: 'span 4' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', maxWidth: 340, mx: { xs: 'auto', md: 0 } }}>
              <Box component="img"
                src={person.profile_path ? getImageUrl(person.profile_path, 'w500') : PlaceholderPerson}
                alt={person.name}
                sx={{ width: '100%', height: 340, objectFit: 'cover', bgcolor: 'grey.200' }}
                onError={e => { e.target.onerror = null; e.target.src = PlaceholderPerson; }}
              />
            </Paper>
          </Grid>
          {/* Person Info */}
          <Grid gridColumn={{ xs: 'span 12', md: 'span 8' }}>
            <Typography variant="h3" fontWeight={700} mb={2} color="text.primary">{person.name}</Typography>
            {person.birthday && (
              <Typography color="text.secondary" mb={1}>
                Born: {new Date(person.birthday).toLocaleDateString()}
                {person.deathday && ` - Died: ${new Date(person.deathday).toLocaleDateString()}`}
              </Typography>
            )}
            {person.place_of_birth && (
              <Typography color="text.secondary" mb={2}>Place of Birth: {person.place_of_birth}</Typography>
            )}
            {person.biography && (
              <Box mb={2}>
                <Typography variant="h5" fontWeight={600} mb={1} color="text.primary">Biography</Typography>
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{person.biography}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        {/* Filmography */}
        <Box mt={8}>
          <FilmographyTable movies={movies} tvShows={tvShows} />
        </Box>
      </Box>
    </Box>
  );
};

export default PersonDetailPage; 