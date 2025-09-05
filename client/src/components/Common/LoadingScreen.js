import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Security } from '@mui/icons-material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Security sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        SecureInvest AI
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Initializing fraud prevention systems...
      </Typography>
      <CircularProgress color="inherit" size={40} />
    </Box>
  );
};

export default LoadingScreen;