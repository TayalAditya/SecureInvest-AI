import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Construction } from '@mui/icons-material';

const SocialMediaMonitor = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Social Media Monitor
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        This feature monitors social media platforms for fraudulent investment schemes and pump-and-dump activities.
      </Alert>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Social media monitoring functionality is under development.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SocialMediaMonitor;