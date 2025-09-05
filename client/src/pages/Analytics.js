import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Construction } from '@mui/icons-material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Insights
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Advanced analytics and insights into fraud patterns and market trends.
      </Alert>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced analytics functionality is under development.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;