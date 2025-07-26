import Link from 'next/link';
import { useRouter } from 'next/router';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import ListAltIcon from '@mui/icons-material/ListAlt';

const navItems = [
  { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { label: 'Orders', href: '/orders', icon: <ShoppingCartIcon /> },
  { label: 'Services', href: '/services', icon: <BuildIcon /> },
  { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
  { label: 'Users', href: '/users', icon: <PeopleIcon /> },
  { label: 'Logs', href: '/logs', icon: <ListAltIcon /> },
  { label: 'Chat', href: '/chat', icon: <ChatIcon /> },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <Drawer variant="permanent" sx={{ width: 220, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box' } }}>
      <Toolbar />
      <List>
        {navItems.map(({ label, href, icon }) => (
          <ListItem button key={href} component={Link} href={href} selected={router.pathname === href}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
