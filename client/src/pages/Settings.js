import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Construction } from '@mui/icons-material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Configure your preferences and notification settings.
      </Alert>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Settings functionality is under development.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;