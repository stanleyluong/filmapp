import { Avatar, Box, Card, CardMedia, Chip, CircularProgress, Grid, Paper, Rating, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchTVShowDetails, fetchTVWatchProviders } from '../services/tmdbApi';
// Placeholder for SeasonList/Accordion component
// import SeasonList from '../components/SeasonList'; 

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

const SeasonsTable = ({ seasons, getImageUrl, tvId }) => {
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Poster</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Episodes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seasons && seasons.length > 0 ? seasons.filter(s => s.season_number > 0).map(season => (
            <TableRow 
              key={season.id} 
              hover 
              onClick={() => navigate(`/tv/${tvId}/season/${season.season_number}`)}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <TableCell>
                <Avatar variant="rounded" src={season.poster_path ? getImageUrl(season.poster_path, 'w92') : '/500x750.png'} alt={season.name} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
              </TableCell>
              <TableCell>{season.name}</TableCell>
              <TableCell>{season.air_date ? new Date(season.air_date).getFullYear() : ''}</TableCell>
              <TableCell>{season.episode_count}</TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={4} align="center">No seasons available.</TableCell></TableRow>
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
            <TableRow
              key={video.id}
              hover
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank', 'noopener,noreferrer')}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <TableCell>
                <img
                  src={`https://img.youtube.com/vi/${video.key}/default.jpg`}
                  alt={video.name}
                  style={{ width: 80, height: 45, borderRadius: 4 }}
                />
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

const TVShowDetailPage = () => {
  const { id: tvId } = useParams();
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();

  // Memoize fetch params to prevent unnecessary rerenders
  const tvShowParams = useMemo(() => ({
    tvId,
    appendToResponse: 'aggregate_credits,videos,recommendations,keywords'
  }), [tvId]);
  const watchProvidersParams = useMemo(() => ({ tvId }), [tvId]);

  const { 
    data: tvShow, 
    isLoading: tvShowLoading, 
    error: tvShowError 
  } = useFetchData(fetchTVShowDetails, tvShowParams);

  const { 
    data: watchProvidersData, 
  } = useFetchData(fetchTVWatchProviders, watchProvidersParams);

  const isLoading = tvShowLoading || configLoading;

  const [tab, setTab] = useState(0);

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }

  if (tvShowError || configError) {
    return <Box textAlign="center" py={10}><Typography color="error">Error loading TV show details: {tvShowError?.message || configError?.message}</Typography></Box>;
  }

  if (!tvShow) {
    return <Box textAlign="center" py={10}><Typography>TV Show not found.</Typography></Box>;
  }

  const {
    name,
    backdrop_path,
    poster_path,
    overview,
    first_air_date,
    last_air_date,
    number_of_seasons,
    number_of_episodes,
    episode_run_time,
    vote_average,
    genres,
    tagline,
    aggregate_credits,
    videos,
    recommendations,
    keywords,
    seasons, // Contains season summaries
    created_by,
    networks
  } = tvShow;

  const backdropUrl = backdrop_path ? getImageUrl(backdrop_path, 'original') : null;
  const posterUrl = poster_path ? getImageUrl(poster_path, 'w500') : '/500x750.png';

  const startYear = first_air_date ? new Date(first_air_date).getFullYear() : '';
  const endYear = last_air_date && tvShow.status === "Ended" ? new Date(last_air_date).getFullYear() : 'Present';
  const yearRange = startYear ? `${startYear} - ${endYear}` : '';
  const avgRuntime = episode_run_time && episode_run_time.length > 0 ? episode_run_time[0] : null;

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
                alt={name}
                sx={{ borderRadius: 2, height: { xs: 180, md: 220 } }}
              />
            </Card>
          </Grid>
          <Grid gridColumn={{ xs: 'span 12', md: 'span 8', lg: 'span 9' }}>
            <Typography variant="h3" fontWeight={700} color="common.white" gutterBottom>
              {name} {yearRange && `(${yearRange})`}
            </Typography>
            {tagline && <Typography variant="h6" color="grey.300" fontStyle="italic" mb={2}>{tagline}</Typography>}
            <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
              {first_air_date && <Typography color="grey.200">First Aired: {new Date(first_air_date).toLocaleDateString()}</Typography>}
              {avgRuntime && <Typography color="grey.200">• ~{avgRuntime}m / episode</Typography>}
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
            <Box mb={2}>
              {number_of_seasons && <Typography color="grey.200">Seasons: {number_of_seasons}</Typography>}
              {number_of_episodes && <Typography color="grey.200">Total Episodes: {number_of_episodes}</Typography>}
              {created_by && created_by.length > 0 && <Typography color="grey.200">Created by: {created_by.map(creator => creator.name).join(', ')}</Typography>}
              {networks && networks.length > 0 && <Typography color="grey.200">Network: {networks.map(network => network.name).join(', ')}</Typography>}
            </Box>
            <Typography variant="h6" color="common.white" mt={3} mb={1}>Overview</Typography>
            <Typography color="grey.100" mb={3}>{overview || 'No overview available.'}</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Tabs Section */}
      <Box maxWidth="lg" mx="auto" px={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Cast" component="div" />
          <Tab label="Seasons" component="div" />
          <Tab label="Where to Watch" component="div" />
          <Tab label="Trailers & Videos" component="div" />
        </Tabs>
        {tab === 0 && <CastTable cast={aggregate_credits?.cast || []} />}
        {tab === 1 && <SeasonsTable seasons={seasons || []} getImageUrl={getImageUrl} tvId={tvId} />}
        {tab === 2 && <WhereToWatchTable providers={providers} />}
        {tab === 3 && <TrailersTable videos={videos?.results || []} />}
      </Box>
      {/* ... existing code for keywords and recommendations ... */}
    </Box>
  );
};

export default TVShowDetailPage; 