import { Box, Grid, Skeleton, Typography } from '@mui/material';
import MediaCard from './MediaCard';

const MediaList = ({ title, items, isLoading, error, listType = 'grid' }) => {
  if (isLoading) {
    const skeletonCount = listType === 'carousel' ? 6 : 12;
    return (
      <Box mb={5}>
        {title && <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>}
        <Grid container spacing={2} wrap={listType === 'carousel' ? 'nowrap' : 'wrap'} sx={listType === 'carousel' ? { overflowX: 'auto', pb: 1 } : {}}>
          {[...Array(skeletonCount)].map((_, index) => (
            <Grid item key={index} sx={listType === 'carousel' ? { minWidth: 180 } : {}}>
              <Skeleton variant="rectangular" width={180} height={270} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mb={5}>
        {title && <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>}
        <Typography color="error">Error loading items: {error.message || 'Could not fetch data.'}</Typography>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box mb={5}>
        {title && <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>}
        <Typography color="text.secondary">No items to display.</Typography>
      </Box>
    );
  }

  return (
    <Box mb={5}>
      {title && <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">{title}</Typography>}
      <Grid container spacing={2} wrap={listType === 'carousel' ? 'nowrap' : 'wrap'} sx={listType === 'carousel' ? { overflowX: 'auto', pb: 1 } : {}}>
        {items.map(item => (
          <Grid
            item
            key={`${item.id}-${item.credit_id || ''}`}
            {...(listType === 'carousel'
              ? { sx: { minWidth: 180 } }
              : { xs: 6, sm: 4, md: 3, lg: 2, xl: 2 })}
          >
            <MediaCard item={item} hideMeta={listType === 'carousel'} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MediaList; 