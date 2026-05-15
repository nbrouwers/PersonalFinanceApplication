import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, BottomNavigation, BottomNavigationAction,
  useMediaQuery, useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Accounts', path: '/accounts', icon: <AccountBalanceIcon /> },
  { label: 'Budgets', path: '/budgets', icon: <CurrencyExchangeIcon /> },
  { label: 'Goals', path: '/goals', icon: <SavingsIcon /> },
  { label: 'Import CSV', path: '/import', icon: <FileUploadIcon /> },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>Finance App</Typography>
      </Toolbar>
      <List>
        {navItems.map(item => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ ml: isMobile ? 0 : `${DRAWER_WIDTH}px` }}>
          <Toolbar>
            <Typography variant="h6" component="div">
              {navItems.find(n => n.path === location.pathname)?.label || 'Personal Finance'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        {isMobile && (
          <BottomNavigation
            value={navItems.findIndex(n => n.path === location.pathname)}
            onChange={(_, index) => navigate(navItems[index].path)}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          >
            {navItems.map(item => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        )}
      </Box>
    </Box>
  );
}

export default Layout;