import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Paper, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem } from '@mui/material';
import { api } from '../utils/api';
import { fetchActiveCurrency, formatPrice } from '../utils/currency';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function OrderForm({ open, onClose, onSave, order, services, currency }) {
  const [customer, setCustomer] = useState(order?.customer || '');
  const [service, setService] = useState(order?.service || '');
  const [price, setPrice] = useState(order?.price || '');
  const [status, setStatus] = useState(order?.status || 'pending');
  useEffect(() => {
    setCustomer(order?.customer || '');
    setService(order?.service || '');
    setPrice(order?.price || '');
    setStatus(order?.status || 'pending');
  }, [order, open]);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{order ? 'Edit Order' : 'Add Order'}</DialogTitle>
      <DialogContent>
        <TextField label="Customer" value={customer} onChange={e => setCustomer(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField select label="Service" value={service} onChange={e => setService(e.target.value)} fullWidth sx={{ mb: 2 }}>
          {services.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
        </TextField>
        <TextField label={`Price${currency ? ` (${currency.symbol})` : ''}`} value={price} onChange={e => setPrice(e.target.value)} fullWidth sx={{ mb: 2 }} type="number" />
        <TextField label="Status" value={status} onChange={e => setStatus(e.target.value)} fullWidth sx={{ mb: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ customer, service, price, status })}>{order ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function OrdersPage() {
  const [currency, setCurrency] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [ordersRes, servicesRes, currencyRes] = await Promise.all([
        api.get('/orders'),
        api.get('/services'),
        fetchActiveCurrency()
      ]);
      setOrders(ordersRes.data);
      setServices(servicesRes.data);
      setCurrency(currencyRes);
      setLoading(false);
    } catch {
      setError('Failed to load orders/services/currency');
      setLoading(false);
    }
  }
  useEffect(() => { fetchData(); }, []);

  function handleAdd() {
    setEditingOrder(null);
    setModalOpen(true);
  }
  function handleEdit(order) {
    setEditingOrder(order);
    setModalOpen(true);
  }
  async function handleSave(form) {
    try {
      if (editingOrder) {
        await api.post(`/orders/${editingOrder._id}`, form);
        setSuccess('Order updated');
      } else {
        await api.post('/orders', form);
        setSuccess('Order added');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      setError('Failed to save order');
    }
  }
  async function handleDelete(id) {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setSuccess('Order deleted');
      fetchData();
    } catch {
      setError('Failed to delete order');
    }
  }

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Orders</Typography>
      <Box mb={2}>
        <Button variant="contained" onClick={handleAdd}>Add Order</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o._id}>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>{services.find(s => s._id === o.service)?.name || o.service}</TableCell>
                  <TableCell>{formatPrice(o.price, currency)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(o)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(o._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <OrderForm open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} order={editingOrder} services={services} currency={currency} />
    </ProtectedLayout>
  );
}
