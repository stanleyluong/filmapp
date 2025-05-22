import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      elevation={3}
      sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', maxWidth: 480, mx: 'auto', width: '100%' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search movies, TV shows, people..."
        inputProps={{ 'aria-label': 'search movies, TV shows, people' }}
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoComplete="off"
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar; 