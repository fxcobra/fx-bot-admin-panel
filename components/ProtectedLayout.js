import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from './Sidebar';

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
  if (!user) return null;
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1} p={3} bgcolor="#f5f5f5" minHeight="100vh">
        {children}
      </Box>
    </Box>
  );
}
