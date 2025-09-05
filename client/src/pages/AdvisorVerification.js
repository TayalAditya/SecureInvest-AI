import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  VerifiedUser,
  Warning,
  Error,
  CheckCircle,
  Person,
  Badge,
  Phone,
  Email,
  Business
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdvisorVerification = () => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    phone: '',
    email: '',
    promisedReturns: '',
    contactMethods: []
  });
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState('');

  const sampleAdvisors = [
    {
      name: "John Doe",
      registrationNumber: "JOHN_DOE_IA_001",
      phone: "+91-9876543210",
      email: "john@example.com",
      promisedReturns: "15",
      contactMethods: ["email", "phone"]
    },
    {
      name: "Fake Advisor",
      registrationNumber: "FAKE_ADVISOR_123",
      phone: "+91-9999999999",
      email: "fake@scam.com",
      promisedReturns: "500",
      contactMethods: ["whatsapp", "telegram"]
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerify = async () => {
    if (!formData.name || !formData.registrationNumber) {
      setError('Name and registration number are required');
      return;
    }

    setLoading(true);
    setError('');
    setVerification(null);

    try {
      const response = await axios.post('/api/fraud-detection/verify-advisor', formData);
      setVerification(response.data.data);
      toast.success('Advisor verification completed');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleData = (sample) => {
    setFormData(sample);
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'error';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'info';
    return 'success';
  };

  const getRiskIcon = (score) => {
    if (score >= 80) return <Error color="error" />;
    if (score >= 60) return <Warning color="warning" />;
    if (score >= 40) return <Warning color="info" />;
    return <CheckCircle color="success" />;
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Advisor Verification
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verify investment advisor credentials against SEBI registered database
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Verification Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advisor Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Advisor Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    required
                    helperText="SEBI registration number (e.g., IA_001)"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Promised Returns (%)"
                    type="number"
                    value={formData.promisedReturns}
                    onChange={(e) => handleInputChange('promisedReturns', e.target.value)}
                    helperText="Annual return percentage promised"
                  />
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box mt={3}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
                  onClick={handleVerify}
                  disabled={loading || !formData.name || !formData.registrationNumber}
                  size="large"
                >
                  {loading ? 'Verifying...' : 'Verify Advisor'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Verification Results */}
          {verification && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Verification Results
                </Typography>

                {/* Registration Status */}
                <Box mb={3}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {verification.isRegistered ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Error color="error" />
                    )}
                    <Typography variant="h6">
                      {verification.isRegistered ? 'SEBI Registered' : 'NOT REGISTERED'}
                    </Typography>
                    <Chip
                      label={verification.isRegistered ? 'VERIFIED' : 'UNVERIFIED'}
                      color={verification.isRegistered ? 'success' : 'error'}
                      variant="filled"
                    />
                  </Box>
                </Box>

                {/* Risk Assessment */}
                <Box mb={3}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {getRiskIcon(verification.riskScore)}
                    <Typography variant="h6">
                      Risk Score: {verification.riskScore}/100
                    </Typography>
                    <Chip
                      label={verification.riskLevel}
                      color={getRiskColor(verification.riskScore)}
                      variant="filled"
                    />
                  </Box>
                </Box>

                {/* Issues Found */}
                {verification.issues && verification.issues.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                      Issues Identified
                    </Typography>
                    <List>
                      {verification.issues.map((issue, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              <Warning color="error" />
                            </ListItemIcon>
                            <ListItemText
                              primary={issue.type.replace('_', ' ')}
                              secondary={issue.message}
                            />
                            <Chip
                              label={issue.severity}
                              color={issue.severity === 'CRITICAL' ? 'error' : 'warning'}
                              size="small"
                            />
                          </ListItem>
                          {index < verification.issues.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Recommendations */}
                {verification.recommendations && verification.recommendations.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    <List>
                      {verification.recommendations.map((recommendation, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={recommendation} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sample Data & Information */}
        <Grid item xs={12} md={4}>
          {/* Sample Advisors */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Try Sample Advisors
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test with these sample advisor profiles
              </Typography>
              
              {sampleAdvisors.map((advisor, index) => (
                <Paper
                  key={index}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: 'action.hover' },
                    border: advisor.registrationNumber.includes('FAKE') ? '1px solid #f44336' : '1px solid #4caf50'
                  }}
                  onClick={() => handleSampleData(advisor)}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {advisor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {advisor.registrationNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Promised Returns: {advisor.promisedReturns}%
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>

          {/* Verification Tips */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Verification Tips
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Badge color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Check SEBI Registration"
                    secondary="Always verify advisor registration on SEBI website"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Business color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Professional Communication"
                    secondary="Legitimate advisors use official channels"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Avoid Guaranteed Returns"
                    secondary="No legitimate advisor can guarantee returns"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Phone color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Beware Social Media"
                    secondary="Avoid advisors who only use WhatsApp/Telegram"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* SEBI Resources */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SEBI Resources
              </Typography>
              
              <List dense>
                <ListItem button component="a" href="https://www.sebi.gov.in" target="_blank">
                  <ListItemText
                    primary="SEBI Official Website"
                    secondary="sebi.gov.in"
                  />
                </ListItem>
                
                <ListItem button>
                  <ListItemText
                    primary="Registered Advisors List"
                    secondary="Check official advisor database"
                  />
                </ListItem>
                
                <ListItem button>
                  <ListItemText
                    primary="Investor Helpline"
                    secondary="1800-266-7575"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvisorVerification;