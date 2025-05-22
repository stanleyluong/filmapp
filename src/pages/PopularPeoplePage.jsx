import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../services/tmdbApi';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: 'profile_path', label: '', disableSort: true },
  { id: 'name', label: 'Name' },
  { id: 'known_for', label: 'Known For', disableSort: true },
  { id: 'popularity', label: 'Popularity' },
];

export default function PopularPeoplePage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('popularity');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchData('/person/popular', { page: page + 1 })
      .then((res) => {
        if (isMounted) {
          setPeople(res.results);
          setTotalResults(res.total_results);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Failed to fetch popular people.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleRequestSort = (event, property) => {
    if (property === 'known_for' || property === 'profile_path') return;
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedPeople = React.useMemo(() => {
    if (orderBy === 'popularity' || orderBy === 'name') {
      return [...people].sort(getComparator(order, orderBy));
    }
    return people;
  }, [people, order, orderBy]);

  return (
    <Box maxWidth="lg" mx="auto" p={{ xs: 1, md: 3 }}>
      <Helmet>
        <title>Popular People - FilmApp</title>
      </Helmet>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Most Popular People
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <TableContainer>
            <Table size="small" sx={{ minWidth: 360 }}>
              <TableHead>
                <TableRow>
                  {headCells.map((cell) => (
                    <TableCell
                      key={cell.id}
                      sortDirection={orderBy === cell.id ? order : false}
                      align={cell.id === 'popularity' ? 'right' : 'left'}
                    >
                      {cell.disableSort ? (
                        cell.label
                      ) : (
                        <TableSortLabel
                          active={orderBy === cell.id}
                          direction={orderBy === cell.id ? order : 'asc'}
                          onClick={(e) => handleRequestSort(e, cell.id)}
                        >
                          {cell.label}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPeople.slice(0, rowsPerPage).map((person) => (
                  <TableRow
                    key={person.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/person/${person.id}`)}
                  >
                    <TableCell>
                      <Avatar
                        src={person.profile_path ? `https://image.tmdb.org/t/p/w92${person.profile_path}` : undefined}
                        alt={person.name}
                        sx={{ width: 48, height: 48 }}
                      />
                    </TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>
                      {person.known_for && person.known_for.length > 0
                        ? person.known_for
                            .map((item) =>
                              item.title || item.name
                            )
                            .join(', ')
                        : ''}
                    </TableCell>
                    <TableCell align="right">{person.popularity.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={Math.min(totalResults, 10000)}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="Rows per page:"
          />
        </Paper>
      )}
    </Box>
  );
} 