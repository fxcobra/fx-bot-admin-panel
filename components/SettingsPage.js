import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Paper, Box, TextField, Button, Switch, FormControlLabel, Divider, Alert, CircularProgress } from '@mui/material';
import { api } from '../utils/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/settings').then(res => {
      setSettings(res.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load settings');
      setLoading(false);
    });
  }, []);

  function handleChange(section, field, value) {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/settings', settings);
      setSettings(res.data);
      setSuccess('Settings saved');
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ProtectedLayout><CircularProgress /></ProtectedLayout>;

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" autoComplete="off" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        {/* Bot Info Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Bot Info</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField label="Bot Name" value={settings.bot?.name || ''} onChange={e => handleChange('bot', 'name', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Description" value={settings.bot?.description || ''} onChange={e => handleChange('bot', 'description', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Logo URL" value={settings.bot?.logoUrl || ''} onChange={e => handleChange('bot', 'logoUrl', e.target.value)} fullWidth sx={{ mb: 2 }} />
        </Paper>
        {/* Contact Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Contact Info</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField label="Email" value={settings.contact?.email || ''} onChange={e => handleChange('contact', 'email', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Phone" value={settings.contact?.phone || ''} onChange={e => handleChange('contact', 'phone', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="WhatsApp" value={settings.contact?.whatsapp || ''} onChange={e => handleChange('contact', 'whatsapp', e.target.value)} fullWidth sx={{ mb: 2 }} />
        </Paper>
        {/* Notifications Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Notifications</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch checked={!!settings.notifications?.enableSMS} onChange={e => handleChange('notifications', 'enableSMS', e.target.checked)} />} label="Enable SMS" />
          <TextField label="SMS Provider" value={settings.notifications?.smsProvider || ''} onChange={e => handleChange('notifications', 'smsProvider', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="SMS API Key" value={settings.notifications?.smsApiKey || ''} onChange={e => handleChange('notifications', 'smsApiKey', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch checked={!!settings.notifications?.enableWhatsApp} onChange={e => handleChange('notifications', 'enableWhatsApp', e.target.checked)} />} label="Enable WhatsApp" />
        </Paper>
        {/* Payments Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Payments</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch checked={!!settings.payments?.enableCheckout} onChange={e => handleChange('payments', 'enableCheckout', e.target.checked)} />} label="Enable Checkout" />
          <TextField label="Currency" value={settings.payments?.currency || ''} onChange={e => handleChange('payments', 'currency', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Payment Methods (comma separated)" value={settings.payments?.methods?.join(', ') || ''} onChange={e => handleChange('payments', 'methods', e.target.value.split(',').map(m => m.trim()))} fullWidth sx={{ mb: 2 }} />
        </Paper>
        {/* UI Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">UI Settings</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField label="Theme" value={settings.ui?.theme || ''} onChange={e => handleChange('ui', 'theme', e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Language" value={settings.ui?.language || ''} onChange={e => handleChange('ui', 'language', e.target.value)} fullWidth sx={{ mb: 2 }} />
        </Paper>
        {/* Custom Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Custom Fields</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField label="Custom JSON" value={JSON.stringify(settings.custom?.fields || {}, null, 2)} onChange={e => {
            let val = {};
            try { val = JSON.parse(e.target.value); } catch {}
            handleChange('custom', 'fields', val);
          }} fullWidth multiline minRows={3} sx={{ mb: 2 }} />
        </Paper>
        {/* Quick Replies Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Quick Replies</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField label="Quick Replies (comma separated)" value={settings.quickReplies?.join(', ') || ''} onChange={e => setSettings(prev => ({ ...prev, quickReplies: e.target.value.split(',').map(q => q.trim()) }))} fullWidth sx={{ mb: 2 }} />
        </Paper>
        <Button type="submit" variant="contained" color="primary" disabled={saving} sx={{ mt: 2 }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </ProtectedLayout>
  );
}
