import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem } from '@mui/material';
import { api } from '../utils/api';
import { fetchActiveCurrency, formatPrice } from '../utils/currency';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ServiceForm({ open, onClose, onSave, service, services, currency }) {
  const [name, setName] = useState(service?.name || '');
  const [price, setPrice] = useState(service?.price || '');
  const [parent, setParent] = useState(service?.parent || '');
  useEffect(() => {
    setName(service?.name || '');
    setPrice(service?.price || '');
    setParent(service?.parent || '');
  }, [service, open]);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{service ? 'Edit Service' : 'Add Service'}</DialogTitle>
      <DialogContent>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label={`Price${currency ? ` (${currency.symbol})` : ''}`} value={price} onChange={e => setPrice(e.target.value)} fullWidth sx={{ mb: 2 }} type="number" />
        <TextField select label="Parent" value={parent} onChange={e => setParent(e.target.value)} fullWidth sx={{ mb: 2 }}>
          <MenuItem value="">None</MenuItem>
          {services.filter(s => !service || s._id !== service._id).map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ name, price, parent: parent || null })}>{service ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ServicesPage() {
  const [currency, setCurrency] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  async function fetchServices() {
    setLoading(true);
    try {
      const [servicesRes, currencyRes] = await Promise.all([
        api.get('/services'),
        fetchActiveCurrency()
      ]);
      setServices(servicesRes.data);
      setCurrency(currencyRes);
      setLoading(false);
    } catch {
      setError('Failed to load services/currency');
      setLoading(false);
    }
  }
  useEffect(() => { fetchServices(); }, []);

  function handleAdd() {
    setEditingService(null);
    setModalOpen(true);
  }
  function handleEdit(service) {
    setEditingService(service);
    setModalOpen(true);
  }
  async function handleSave(form) {
    try {
      if (editingService) {
        await api.post(`/services/${editingService._id}`, form);
        setSuccess('Service updated');
      } else {
        await api.post('/services', form);
        setSuccess('Service added');
      }
      setModalOpen(false);
      fetchServices();
    } catch {
      setError('Failed to save service');
    }
  }
  async function handleDelete(id) {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setSuccess('Service deleted');
      fetchServices();
    } catch {
      setError('Failed to delete service');
    }
  }

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Services</Typography>
      <Box mb={2}>
        <Button variant="contained" onClick={handleAdd}>Add Service</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map(s => (
                <TableRow key={s._id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{formatPrice(s.price, currency)}</TableCell>
                  <TableCell>{services.find(p => p._id === s.parent)?.name || ''}</TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(s)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(s._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ServiceForm open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} service={editingService} services={services} currency={currency} />
    </ProtectedLayout>
  );
}
