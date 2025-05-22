import { Box, Card, Grid, Typography } from '@mui/material';

const CARD_SIZE = 340;
const VIDEO_HEIGHT = 190;

const VideoList = ({ videos, title = "Trailers & Videos" }) => {
  if (!videos || videos.length === 0) {
    return null;
  }

  const officialTrailers = videos
    .filter(video => video.site === 'YouTube' && video.type === 'Trailer' && video.official)
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  const otherVideos = videos
    .filter(video => video.site === 'YouTube' && !officialTrailers.find(t => t.id === video.id))
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    
  const displayVideos = [...officialTrailers, ...otherVideos].slice(0, 4); // Max 4 videos for now

  if(displayVideos.length === 0) {
    return (
      <Box mb={6}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>
        <Typography color="text.secondary">No official YouTube trailers or videos found.</Typography>
      </Box>
    );
  }

  return (
    <Box mb={6}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>
      <Grid container spacing={3}>
        {displayVideos.map(video => (
          <Grid item key={video.id}>
            <Card sx={{ width: CARD_SIZE, height: VIDEO_HEIGHT, display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', width: '100%', height: '100%', flexShrink: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoList; 