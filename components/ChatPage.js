import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Box, CircularProgress, Alert, List, ListItem, ListItemText, Paper, Divider, TextField, Button } from '@mui/material';
import { api } from '../utils/api';

export default function ChatPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/orders').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load conversations');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      setDetail(null);
      api.get(`/orders/${selected}`).then(res => {
        setDetail(res.data);
      }).catch(() => setError('Failed to load conversation'));
    }
  }, [selected]);

  const handleSend = async () => {
    setSending(true);
    setSuccess('');
    try {
      await api.post(`/orders/${selected}/reply`, { message: reply });
      setReply('');
      setSuccess('Reply sent');
      // Refresh detail
      const res = await api.get(`/orders/${selected}`);
      setDetail(res.data);
    } catch {
      setError('Failed to send reply');
    }
    setSending(false);
  };

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Chat</Typography>
      <Box display="flex" gap={2}>
        <Paper sx={{ width: 320, minHeight: 400 }}>
          <Typography sx={{ p: 2 }} variant="subtitle1">Conversations</Typography>
          <Divider />
          {loading ? <CircularProgress sx={{ m: 2 }} /> : (
            <List>
              {orders.map(o => (
                <ListItem button selected={selected === o._id} onClick={() => setSelected(o._id)} key={o._id} alignItems="flex-start">
                  <ListItemText primary={`Order #${o._id.slice(-5)}`} secondary={o.customer + ' - ' + (o.status || '')} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
        <Box flex={1}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {!detail ? <Typography>Select a conversation</Typography> : (
            <Paper sx={{ p: 2, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1">Order #{detail._id.slice(-5)} - {detail.customer}</Typography>
              <Typography variant="body2" color="text.secondary">Status: {detail.status}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box flex={1} sx={{ overflowY: 'auto', mb: 2 }}>
                {detail.messages && detail.messages.length > 0 ? detail.messages.map((msg, i) => (
                  <Box key={i} sx={{ mb: 1, textAlign: msg.isCustomer ? 'left' : 'right' }}>
                    <Paper sx={{ display: 'inline-block', px: 2, py: 1, bgcolor: msg.isCustomer ? '#f5f5f5' : '#e3f2fd' }}>
                      <Typography variant="body2">{msg.text}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(msg.timestamp).toLocaleString()} {msg.isCustomer ? '' : '(admin)'}</Typography>
                    </Paper>
                  </Box>
                )) : <Typography>No messages.</Typography>}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  disabled={sending}
                  multiline
                  minRows={1}
                  maxRows={4}
                />
                <Button variant="contained" onClick={handleSend} disabled={!reply || sending}>Send</Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </ProtectedLayout>
  );
}
