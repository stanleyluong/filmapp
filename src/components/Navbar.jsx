import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Button, Dialog, IconButton, InputBase, Toolbar, Typography, useMediaQuery } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const navLinks = [
  { label: 'Top Rated Movies', to: '/top-rated-movies' },
  { label: 'Top Rated TV Shows', to: '/top-rated-tv-shows' },
  { label: 'Popular People', to: '/popular-people' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const firstDrawerLinkRef = useRef(null);

  useEffect(() => {
    if (drawerOpen) {
      setTimeout(() => {
        firstDrawerLinkRef.current?.focus();
      }, 0);
    } else {
      hamburgerRef.current?.focus();
    }
  }, [drawerOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ flexDirection: { xs: 'row', md: 'row' }, alignItems: 'center', py: { xs: 1, md: 0 }, justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" flexGrow={1} sx={{ mb: { xs: 0, md: 0 } }}>
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
          {/* Search Bar */}
          {!isMobile && (
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ ml: 3, flexGrow: 1, maxWidth: 400, bgcolor: '#f1f3f6', borderRadius: 2, px: 2, py: 0.5, display: 'flex', alignItems: 'center' }}>
              <InputBase
                placeholder="Search movies, TV shows, people..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                sx={{ flex: 1 }}
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="submit" color="primary" aria-label="search">
                <SearchIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* Hamburger and search for mobile, right-aligned */}
        {isMobile && (
          <Box display="flex" alignItems="center" ml="auto">
            <IconButton color="primary" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => setDrawerOpen(true)} ref={hamburgerRef}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        {/* Nav Links (hide on mobile) */}
        {!isMobile && (
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 1, md: 0 }} width={{ xs: '100%', md: 'auto' }} alignItems={{ xs: 'stretch', md: 'center' }}>
            {navLinks.map(link => (
              <Button
                key={link.to}
                component={RouterLink}
                to={link.to}
                color="primary"
                variant="text"
                sx={{ fontWeight: 600, mr: { md: 2, xs: 0 }, width: { xs: '100%', md: 'auto' } }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
      {/* Mobile Search Dialog */}
      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <InputBase
            autoFocus
            placeholder="Search movies, TV shows, people..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            sx={{ flex: 1 }}
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton type="submit" color="primary" aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
      </Dialog>
      {/* Mobile Drawer for nav links */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navLinks.map((link, idx) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.to}
                  ref={idx === 0 ? firstDrawerLinkRef : undefined}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 