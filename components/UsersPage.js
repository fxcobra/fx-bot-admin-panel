import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { api } from '../utils/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function UserForm({ open, onClose, onSave, user }) {
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'admin');
  useEffect(() => {
    setUsername(user?.username || '');
    setPassword('');
    setRole(user?.role || 'admin');
  }, [user, open]);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} type="password" helperText={user ? 'Leave blank to keep unchanged' : ''} />
        <TextField label="Role" value={role} onChange={e => setRole(e.target.value)} fullWidth sx={{ mb: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ username, password, role })}>{user ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  function fetchUsers() {
    setLoading(true);
    api.get('/users').then(res => {
      setUsers(res.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load users');
      setLoading(false);
    });
  }
  useEffect(() => { fetchUsers(); }, []);

  function handleAdd() {
    setEditingUser(null);
    setModalOpen(true);
  }
  function handleEdit(user) {
    setEditingUser(user);
    setModalOpen(true);
  }
  async function handleSave(form) {
    try {
      if (editingUser) {
        await api.post(`/users/${editingUser._id}`, form);
        setSuccess('User updated');
      } else {
        await api.post('/users', form);
        setSuccess('User added');
      }
      setModalOpen(false);
      fetchUsers();
    } catch {
      setError('Failed to save user');
    }
  }
  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setSuccess('User deleted');
      fetchUsers();
    } catch {
      setError('Failed to delete user');
    }
  }

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Box mb={2}>
        <Button variant="contained" onClick={handleAdd}>Add User</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u._id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(u)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(u._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <UserForm open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} user={editingUser} />
    </ProtectedLayout>
  );
}
