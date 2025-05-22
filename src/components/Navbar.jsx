import MovieIcon from '@mui/icons-material/Movie';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, py: { xs: 1, md: 0 } }}>
        <Box display="flex" alignItems="center" flexGrow={1} sx={{ mb: { xs: 1, md: 0 } }}>
          <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            FilmApp
          </Typography>
        </Box>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 1, md: 0 }} width={{ xs: '100%', md: 'auto' }} alignItems={{ xs: 'stretch', md: 'center' }}>
          <Button
            component={RouterLink}
            to="/top-rated-movies"
            color="primary"
            variant="text"
            sx={{ fontWeight: 600, mr: { md: 2, xs: 0 }, width: { xs: '100%', md: 'auto' } }}
          >
            Top Rated Movies
          </Button>
          <Button
            component={RouterLink}
            to="/top-rated-tv-shows"
            color="primary"
            variant="text"
            sx={{ fontWeight: 600, mr: { md: 2, xs: 0 }, width: { xs: '100%', md: 'auto' } }}
          >
            Top Rated TV Shows
          </Button>
          <Button
            component={RouterLink}
            to="/about"
            color="primary"
            variant="text"
            sx={{ fontWeight: 600, width: { xs: '100%', md: 'auto' } }}
          >
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 