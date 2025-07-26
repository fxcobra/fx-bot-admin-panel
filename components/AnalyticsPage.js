import { useEffect, useState } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { Typography, Box, CircularProgress, Alert, Grid, Paper } from '@mui/material';
import { api } from '../utils/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB47BC', '#90A4AE'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics').then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load analytics');
      setLoading(false);
    });
  }, []);

  const ordersByStatusData = stats ? Object.entries(stats.ordersByStatus).map(([status, count], i) => ({ name: status, value: count, color: STATUS_COLORS[i % STATUS_COLORS.length] })) : [];
  const topServicesData = stats ? stats.topServices.map(s => ({ name: s.name, Orders: s.count })) : [];

  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <CircularProgress /> : stats ? (
        <Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2 }}><Typography variant="h6">Total Orders</Typography><Typography variant="h4">{stats.totalOrders}</Typography></Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2 }}><Typography variant="h6">Total Revenue</Typography><Typography variant="h4">${stats.totalRevenue}</Typography></Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2 }}><Typography variant="h6">Users</Typography><Typography variant="h4">{stats.userCount}</Typography></Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2 }}><Typography variant="h6">Active Services</Typography><Typography variant="h4">{stats.serviceCount}</Typography></Paper>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 340 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Orders by Status</Typography>
                {ordersByStatusData.length === 0 ? <Typography>No data</Typography> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={ordersByStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {ordersByStatusData.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 340 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Top Services</Typography>
                {topServicesData.length === 0 ? <Typography>No data</Typography> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={topServicesData} layout="vertical">
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Bar dataKey="Orders" fill="#0088FE" />
                      <Tooltip />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : <Typography>No analytics data.</Typography>}
    </ProtectedLayout>
  );
}
