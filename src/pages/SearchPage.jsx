import SearchResultRow from '@/components/SearchResultRow';
import useFetchData from '@/hooks/useFetchData';
import { searchMovies, searchPeople, searchTVShows } from '@/services/tmdbApi';
import {
    Box, CircularProgress,
    Pagination as MuiPagination, Paper,
    Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs,
    Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PeopleTable from '../components/PeopleTable';

const columns = [
  { key: 'poster', label: 'Poster', minWidth: 60, align: 'center' },
  { key: 'title', label: 'Title', minWidth: 180 },
  { key: 'year', label: 'Year', minWidth: 80, align: 'center' },
  { key: 'media_type', label: 'Type', minWidth: 100, align: 'center' },
  { key: 'overview', label: 'Overview', minWidth: 200 },
  { key: 'rating', label: 'Rating', minWidth: 90, align: 'center' },
];

const SortIcon = ({ direction }) => {
  if (!direction) return null;
  return direction === 'asc' ? '▲' : '▼';
};

const TABS = [
  { label: 'Movies', value: 'movies' },
  { label: 'TV Shows', value: 'tv' },
  { label: 'People', value: 'people' },
];

const PAGE_SIZE = 20; // TMDB default

const tabApiMap = {
  movies: searchMovies,
  tv: searchTVShows,
  people: searchPeople,
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [tab, setTab] = useState('movies');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [tabCounts, setTabCounts] = useState({ movies: 0, tv: 0, people: 0 });

  // Fetch data for the active tab only
  const searchApiParams = useMemo(() => ({ query, page: currentPage }), [query, currentPage]);
  const { data, isLoading, error } = useFetchData(tabApiMap[tab], searchApiParams, true);

  // Fetch tab counts in the background when query changes
  useEffect(() => {
    let cancelled = false;
    if (query) {
      Promise.all([
        searchMovies({ query, page: 1 }),
        searchTVShows({ query, page: 1 }),
        searchPeople({ query, page: 1 })
      ]).then(([moviesRes, tvRes, peopleRes]) => {
        if (!cancelled) {
          setTabCounts({
            movies: moviesRes?.total_results || 0,
            tv: tvRes?.total_results || 0,
            people: peopleRes?.total_results || 0,
          });
        }
      });
    } else {
      setTabCounts({ movies: 0, tv: 0, people: 0 });
    }
    return () => { cancelled = true; };
  }, [query]);

  // Results
  const rawResults = data?.results || [];

  // Sorting (only for media tabs)
  const getSorted = (items) => {
    let sortableItems = [...items];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'title') {
          valA = (a.title || a.name || '').toLowerCase();
          valB = (b.title || b.name || '').toLowerCase();
        } else if (sortConfig.key === 'year') {
          valA = parseInt(a.release_date || a.first_air_date || '0', 10);
          valB = parseInt(b.release_date || b.first_air_date || '0', 10);
        } else if (sortConfig.key === 'rating') {
          valA = a.vote_average || 0;
          valB = b.vote_average || 0;
        } else if (sortConfig.key === 'media_type') {
          valA = (a.media_type || (a.release_date ? 'movie' : 'tv')).toLowerCase();
          valB = (b.media_type || (b.release_date ? 'movie' : 'tv')).toLowerCase();
        } else if (sortConfig.key === 'overview') {
          valA = (a.overview || '').toLowerCase();
          valB = (b.overview || '').toLowerCase();
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  };

  // Pagination helpers
  const getPage = (items) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setSearchParams({ q: query, page: '1' }); // Reset to page 1 on tab change
  };

  const handlePageChange = (_, newPage) => {
    setSearchParams({ q: query, page: newPage.toString() });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!query && !isLoading) {
    return <Box maxWidth="md" mx="auto" py={8} textAlign="center"><Typography>Please enter a search term.</Typography></Box>;
  }

  return (
    <Box maxWidth="lg" mx="auto" py={4}>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">
        Search Results for: <Box component="span" color="primary.dark">{query}</Box>
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        {TABS.map(t => (
          <Tab key={t.value} label={`${t.label} (${tabCounts[t.value]})`} value={t.value} />
        ))}
      </Tabs>
      {isLoading && (
        <Box textAlign="center" py={8}><CircularProgress /></Box>
      )}
      {!isLoading && error && (
        <Typography color="error" py={8}>Error loading results: {error.message}</Typography>
      )}
      {/* Movies/TV Tabs */}
      {!isLoading && !error && (tab === 'movies' || tab === 'tv') && rawResults.length === 0 && (
        <Typography color="text.secondary" py={8} textAlign="center">
          {query ? `No ${tab === 'movies' ? 'movies' : 'TV shows'} found for "${query}".` : 'No results to display.'}
        </Typography>
      )}
      {!isLoading && !error && (tab === 'movies' || tab === 'tv') && rawResults.length > 0 && (
        <Paper elevation={2} sx={{ mb: 4 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell
                      key={col.key}
                      align={col.align || 'left'}
                      style={{ minWidth: col.minWidth }}
                      sortDirection={sortConfig.key === col.key ? sortConfig.direction : false}
                    >
                      <TableSortLabel
                        active={sortConfig.key === col.key}
                        direction={sortConfig.key === col.key ? sortConfig.direction : 'asc'}
                        onClick={() => requestSort(col.key)}
                        IconComponent={SortIcon}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getPage(getSorted(rawResults)).map(item => (
                  <SearchResultRow key={`${item.id}-${item.media_type}`} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {/* People Tab */}
      {!isLoading && !error && tab === 'people' && rawResults.length === 0 && (
        <Typography color="text.secondary" py={8} textAlign="center">
          {query ? `No people found for "${query}".` : 'No results to display.'}
        </Typography>
      )}
      {!isLoading && !error && tab === 'people' && rawResults.length > 0 && (
        <PeopleTable people={rawResults} />
      )}
      {/* Pagination for all tabs if needed */}
      {data && data.total_pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <MuiPagination
            count={data.total_pages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchPage; 