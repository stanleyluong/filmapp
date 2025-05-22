import MovieIcon from '@mui/icons-material/Movie';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
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
        <Button
          component={RouterLink}
          to="/about"
          color="primary"
          variant="text"
          sx={{ fontWeight: 600 }}
        >
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 