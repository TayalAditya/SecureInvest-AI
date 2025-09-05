import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard,
  Security,
  VerifiedUser,
  Twitter as SocialMedia,
  Description,
  Report,
  Analytics,
  Settings,
  Info
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Fraud Detection', icon: <Security />, path: '/fraud-detection' },
  { text: 'Advisor Verification', icon: <VerifiedUser />, path: '/advisor-verification' },
  { text: 'Social Media Monitor', icon: <SocialMedia />, path: '/social-media-monitor' },
  { text: 'Document Verification', icon: <Description />, path: '/document-verification' },
  { text: 'Report Fraud', icon: <Report />, path: '/report-fraud' },
];

const secondaryItems = [
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
  { text: 'About', icon: <Info />, path: '/about' },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, mt: 8 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Fraud Prevention
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Protecting investors from securities fraud
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        {secondaryItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;