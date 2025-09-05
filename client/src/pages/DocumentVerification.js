import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { Construction } from '@mui/icons-material';

const DocumentVerification = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Document Verification
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        This feature verifies the authenticity of regulatory documents and corporate announcements.
      </Alert>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Document verification functionality is under development.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentVerification;