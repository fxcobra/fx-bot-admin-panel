import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, TablePagination } from '@mui/material';
import { api } from '../utils/api';

const LEVELS = ['', 'info', 'warn', 'error', 'debug'];

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    setLoading(true);
    api.get('/logs', { params: { level, search } }).then(res => {
      setLogs(res.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load logs');
      setLoading(false);
    });
  }, [level, search]);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = e => { setRowsPerPage(+e.target.value); setPage(0); };

  const filteredLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Logs</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField select label="Level" value={level} onChange={e => setLevel(e.target.value)} sx={{ width: 120 }}>
          {LEVELS.map(l => <MenuItem key={l} value={l}>{l || 'All'}</MenuItem>)}
        </TextField>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} sx={{ width: 200 }} />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <CircularProgress /> : logs.length === 0 ? <Typography>No logs found.</Typography> : (
        <>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Meta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.level}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.meta ? JSON.stringify(log.meta) : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={logs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[25, 50, 100]}
        />
        </>
      )}
    </ProtectedLayout>
  );
}
