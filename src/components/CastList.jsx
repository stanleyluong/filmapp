import { Box, Grid, Typography } from '@mui/material';
import CastMemberCard from './CastMemberCard';

const CastList = ({ cast, title = "Cast" }) => {
  if (!cast || cast.length === 0) {
    return null; // Or a message like "No cast information available."
  }

  return (
    <Box mb={8}>
      <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">{title}</Typography>
      <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 1 }}>
        {cast.map(person => (
          <Grid key={person.cast_id || person.id || person.credit_id} sx={{ minWidth: 140, maxWidth: 160 }}>
            <CastMemberCard person={person} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CastList; 