import { Box, Divider, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const techStack = [
  { name: 'React', description: 'UI library for building user interfaces (v18+)' },
  { name: 'Vite', description: 'Fast build tool and dev server' },
  { name: 'React Router', description: 'Declarative routing for React apps' },
  { name: 'Axios', description: 'Promise-based HTTP client for API requests' },
  { name: 'Material UI', description: 'Modern React UI framework for fast, accessible design' },
  { name: 'TMDB API', description: 'The Movie Database API for movie/TV/person data' },
  { name: 'react-helmet-async', description: 'SEO and dynamic page titles for React apps' },
  { name: 'ESLint & Prettier', description: 'Code linting and formatting' },
];

const features = [
  'Deep exploration of movies, TV shows, and people with rich detail pages',
  'Instant search for movies, TV shows, and people with tabbed results',
  'Clickable cast and recommendation rows for seamless discovery',
  'Comprehensive episode and season information for TV shows',
  'Watch provider info: see where to stream, rent, or buy',
  'Trailers and videos integrated into detail pages',
  'Personalized recommendations and trending content',
  'Consistent, accessible, and responsive design for all devices',
];

const AboutPage = () => (
  <Box maxWidth="md" mx="auto" py={8} px={2}>
    <Typography variant="h3" component="h1" color="primary" fontWeight={700} gutterBottom>
      About FilmApp
    </Typography>
    <Divider sx={{ mb: 3, width: 64, borderBottomWidth: 4, borderColor: 'primary.main' }} />
    <Typography variant="h6" color="text.secondary" mb={4}>
      <Box component="span" fontWeight={600} color="text.primary">FilmApp</Box> helps you discover, search, and explore movies, TV shows, and people with a fast, modern, and intuitive interface. Built for film fans and binge-watchers alike, FilmApp puts the world of entertainment at your fingertips.
    </Typography>
    <Paper elevation={2} sx={{ p: 3, mb: 6, background: 'background.paper' }}>
      <Typography variant="h5" fontWeight={700} color="primary" mb={2}>Features</Typography>
      <List sx={{ mb: 2 }}>
        {features.map((feature, idx) => (
          <ListItem key={idx} disableGutters sx={{ py: 1 }}>
            <ListItemText primary={<Typography variant="body1" color="text.primary">{feature}</Typography>} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight={700} color="primary" mb={1}>Tech Stack</Typography>
      <List>
        {techStack.map((tech) => (
          <ListItem key={tech.name} disableGutters sx={{ py: 1.5 }}>
            <ListItemText
              primary={<Typography variant="subtitle1" color="primary" fontWeight={600}>{tech.name}</Typography>}
              secondary={<Typography variant="body2" color="text.secondary">{tech.description}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  </Box>
);

export default AboutPage; 