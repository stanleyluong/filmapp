import { Avatar, Box, Pagination, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTmdbConfig } from '../hooks/useTmdbConfig';

const PAGE_SIZE = 20;

function getYear(item) {
  const date = item.release_date || item.first_air_date;
  return date ? new Date(date).getFullYear() : '';
}

function getRole(item) {
  return item.character || item.job || '';
}

const columns = [
  { key: 'poster', label: 'Poster' },
  { key: 'title', label: 'Title' },
  { key: 'year', label: 'Year' },
  { key: 'role', label: 'Role/Character' },
];

const FilmographyTable = ({ movies, tvShows }) => {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const { getImageUrl } = useTmdbConfig();
  const navigate = useNavigate();

  const data = tab === 0 ? movies : tvShows;
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  return (
    <Box>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={`Movies (${movies.length})`} />
        <Tab label={`TV Shows (${tvShows.length})`} />
      </Tabs>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="text.secondary">No items to display.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map(item => {
                const mediaType = item.media_type || (item.release_date ? 'movie' : 'tv');
                const linkPath = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
                const title = item.title || item.name;
                const posterUrl = item.poster_path ? getImageUrl(item.poster_path, 'w92') : '/500x750.png';
                return (
                  <TableRow 
                    key={`${item.id}-${item.credit_id || ''}`}
                    hover
                    onClick={() => navigate(linkPath)}
                    style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Avatar variant="rounded" src={posterUrl} alt={title} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
                    </TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>{getYear(item)}</TableCell>
                    <TableCell>{getRole(item)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length > PAGE_SIZE && (
        <Pagination
          count={Math.ceil(data.length / PAGE_SIZE)}
          page={page}
          onChange={(_, val) => setPage(val)}
          sx={{ display: 'flex', justifyContent: 'center' }}
        />
      )}
    </Box>
  );
};

export default FilmographyTable; 