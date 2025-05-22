import { Box, Divider, List, ListItem, ListItemText, Link as MuiLink, Paper, Typography } from '@mui/material';

const techStack = [
  { name: 'React', description: 'UI library for building user interfaces (v18+)' },
  { name: 'Vite', description: 'Fast build tool and dev server' },
  { name: 'React Router', description: 'Declarative routing for React apps' },
  { name: 'Axios', description: 'Promise-based HTTP client for API requests' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development' },
  { name: 'Shadcn UI', description: 'Beautiful, accessible React components built on Radix UI and Tailwind' },
  { name: 'TMDB API', description: 'The Movie Database API for movie/TV/person data' },
  { name: 'Lucide React', description: 'Icon library for React' },
  { name: 'react-simple-star-rating', description: 'Star rating component for displaying ratings' },
  { name: 'PostCSS & Autoprefixer', description: 'CSS processing and vendor prefixing' },
  { name: 'Radix UI', description: 'Primitives for building accessible UI components (used by Shadcn)' },
  { name: 'ESLint & Prettier', description: 'Code linting and formatting' },
];

const features = [
  'Clickable cast and recommendation rows for deeper exploration of people and movies',
  'Improved episode and TV show detail pages with richer information and modern layout',
  'Trailers accessible by clicking anywhere on the row, not just the thumbnail',
  'Consistent navigation and user experience across movie and TV pages',
  'Focus on accessibility and responsive design for all devices',
];

const AboutPage = () => (
  <Box maxWidth="md" mx="auto" py={8} px={2}>
    <Typography variant="h3" component="h1" color="primary" fontWeight={700} gutterBottom>
      About FilmFinder
    </Typography>
    <Divider sx={{ mb: 3, width: 64, borderBottomWidth: 4, borderColor: 'primary.main' }} />
    <Typography variant="h6" color="text.secondary" mb={4}>
      <Box component="span" fontWeight={600} color="text.primary">FilmFinder</Box> is a modern movie and TV discovery app built with the latest web technologies. Here are some of the features and technologies powering this project:
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
    <Box mt={8} textAlign="center" color="text.secondary" fontSize={14}>
      &copy; {new Date().getFullYear()} <Box component="span" fontWeight={600} color="text.primary">FilmFinder</Box>. All rights reserved.<br />
      <Box component="span" display="inline-block" mt={1}>
        Movie and TV Show data provided by{' '}
        <MuiLink href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" color="primary" fontWeight={600} underline="hover">
          TMDb
        </MuiLink>.
      </Box>
    </Box>
  </Box>
);

export default AboutPage; 