import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PlaceholderPerson from '../assets/placeholder-person.svg';
import { useTmdbConfig } from '../hooks/useTmdbConfig';

const CARD_WIDTH = 140;
const IMAGE_HEIGHT = 190;

const CastMemberCard = ({ person }) => {
  const { getImageUrl, loading: configLoading, error: configError } = useTmdbConfig();

  if (!person) return null;

  const imageUrl = person.profile_path 
    ? getImageUrl(person.profile_path, 'w185') 
    : PlaceholderPerson;

  if (configLoading) {
    return <Skeleton variant="rectangular" width={CARD_WIDTH} height={IMAGE_HEIGHT + 60} sx={{ borderRadius: 2 }} />;
  }
  if (configError) {
    return <Typography color="error" fontSize={12}>Err</Typography>;
  }

  return (
    <Card sx={{ width: CARD_WIDTH, borderRadius: 2, boxShadow: 2, bgcolor: 'background.paper' }}>
      <CardActionArea component={Link} to={`/person/${person.id}`} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={person.name}
          sx={{ width: CARD_WIDTH, height: IMAGE_HEIGHT, objectFit: 'cover', borderRadius: 2, bgcolor: 'grey.200' }}
          onError={(e) => { e.target.onerror = null; e.target.src = PlaceholderPerson; }}
        />
        <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap title={person.name} sx={{ mb: 0.5 }}>
            {person.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CastMemberCard; 