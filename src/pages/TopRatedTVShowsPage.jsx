import { Avatar, Box, CircularProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTmdbConfig } from '../hooks/useTmdbConfig';
import { fetchTopRatedTVShows } from '../services/tmdbApi';

const columns = [
  { key: 'poster', label: 'Poster' },
  { key: 'name', label: 'Title' },
  { key: 'year', label: 'Year' },
  { key: 'rating', label: 'Rating' },
  { key: 'overview', label: 'Overview' },
];

const PAGE_SIZE = 20;

const TopRatedTVShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'rating', direction: 'desc' });
  const { getImageUrl } = useTmdbConfig();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchTopRatedTVShows({ page })
      .then(data => {
        setShows(data.results || []);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDb API max 500 pages
        setIsLoading(false);
      })
      .catch(e => {
        setError('Failed to load top rated TV shows.');
        setIsLoading(false);
      });
  }, [page]);

  const sortedShows = useMemo(() => {
    if (!shows) return [];
    const sorted = [...shows];
    sorted.sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === 'name') {
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
      } else if (sortConfig.key === 'year') {
        aValue = a.first_air_date ? new Date(a.first_air_date).getFullYear() : 0;
        bValue = b.first_air_date ? new Date(b.first_air_date).getFullYear() : 0;
      } else if (sortConfig.key === 'rating') {
        aValue = a.vote_average || 0;
        bValue = b.vote_average || 0;
      } else {
        aValue = a[sortConfig.key] || '';
        bValue = b[sortConfig.key] || '';
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [shows, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  return (
    <Box maxWidth="lg" mx="auto" py={6} px={2}>
      <Typography variant="h3" fontWeight={700} color="primary" mb={4}>
        Top Rated TV Shows
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh"><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : (
        <Paper elevation={2}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      <TableSortLabel
                        active={sortConfig.key === col.key}
                        direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedShows.map(show => {
                  const posterUrl = show.poster_path ? getImageUrl(show.poster_path, 'w92') : '/500x750.png';
                  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
                  return (
                    <TableRow
                      key={show.id}
                      hover
                      onClick={() => navigate(`/tv/${show.id}`)}
                      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                    >
                      <TableCell>
                        <Avatar variant="rounded" src={posterUrl} alt={show.name} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
                      </TableCell>
                      <TableCell>{show.name}</TableCell>
                      <TableCell>{year}</TableCell>
                      <TableCell>{show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}</TableCell>
                      <TableCell>{show.overview ? show.overview.substring(0, 100) + (show.overview.length > 100 ? '...' : '') : ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" my={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TopRatedTVShowsPage; 