import { Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTmdbConfig } from '../hooks/useTmdbConfig';

const columns = [
  { key: 'profile', label: 'Profile' },
  { key: 'name', label: 'Name' },
  { key: 'known_for', label: 'Known For' },
  { key: 'department', label: 'Department' },
  { key: 'popularity', label: 'Popularity' },
];

const PeopleTable = ({ people }) => {
  const { getImageUrl } = useTmdbConfig();
  const navigate = useNavigate();

  return (
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
          {people.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography color="text.secondary">No people found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            people.map(person => {
              const profileUrl = person.profile_path ? getImageUrl(person.profile_path, 'w92') : '/500x750.png';
              const knownFor = person.known_for && Array.isArray(person.known_for)
                ? person.known_for.map(kf => kf.title || kf.name).filter(Boolean).join(', ')
                : '';
              return (
                <TableRow
                  key={person.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/person/${person.id}`)}
                >
                  <TableCell>
                    <Avatar variant="rounded" src={profileUrl} alt={person.name} sx={{ width: 40, height: 60, bgcolor: 'grey.200' }} />
                  </TableCell>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{knownFor}</TableCell>
                  <TableCell>{person.known_for_department || ''}</TableCell>
                  <TableCell>{person.popularity ? person.popularity.toFixed(1) : ''}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PeopleTable; 