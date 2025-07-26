import ProtectedLayout from './ProtectedLayout';
import { Typography, Paper, Box } from '@mui/material';

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <Typography variant="h4" gutterBottom>Welcome to Fx Admin Panel</Typography>
      <Box display="flex" gap={2} flexWrap="wrap">
        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="h6">Orders</Typography>
          <Typography variant="h4">-</Typography>
        </Paper>
        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="h6">Revenue</Typography>
          <Typography variant="h4">-</Typography>
        </Paper>
        <Paper sx={{ p: 3, minWidth: 220 }}>
          <Typography variant="h6">Active Users</Typography>
          <Typography variant="h4">-</Typography>
        </Paper>
      </Box>
    </ProtectedLayout>
  );
}
