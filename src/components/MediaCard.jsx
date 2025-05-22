import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTmdbConfig } from '../hooks/useTmdbConfig';

// A simple star rating display component (optional, can be enhanced)
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {halfStar && (
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z M10 12.44V0L7.539 5.045l-5.508.8L6.02 9.815l-.936 5.455L10 12.44z"/></svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      <span className="ml-1 text-[10px] sm:text-xs text-gray-400">({rating.toFixed(1)}/10)</span>
    </div>
  );
};

const MediaCard = ({ item, hideMeta = false }) => {
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();

  if (!item) return null;

  const { id, title, name, poster_path, media_type, release_date, first_air_date } = item;
  const imageUrl = poster_path ? getImageUrl(poster_path, 'w342') : '/500x750.png';
  const mediaTypeDetected = media_type || (release_date ? 'movie' : 'tv');
  const linkPath = mediaTypeDetected === 'movie' ? `/movie/${id}` : `/tv/${id}`;
  const displayTitle = title || name;
  const date = release_date || first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  if (configLoading) {
    return <Box sx={{ width: 180, height: 270, bgcolor: 'grey.800', borderRadius: 2 }} />;
  }
  if (configError) {
    return <Typography color="error">Error loading image config.</Typography>;
  }

  return (
    <Card sx={{ width: 180, height: 270, borderRadius: 2, boxShadow: 2 }}>
      <CardActionArea component={Link} to={linkPath} sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="270"
          image={imageUrl}
          alt={displayTitle}
          sx={{ objectFit: 'cover', borderRadius: 2, height: 270 }}
        />
        {!hideMeta && (
          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>{displayTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {year !== 'N/A' ? year : ''}
            </Typography>
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  );
};

export default MediaCard; 