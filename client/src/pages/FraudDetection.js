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
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import {
  Security,
  Warning,
  Error,
  CheckCircle,
  Info,
  ExpandMore,
  ContentPaste,
  Send,
  Psychology,
  TrendingUp
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const FraudDetection = () => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  // Sample fraudulent content for testing
  const sampleContent = [
    {
      title: "High-Risk Investment Scheme",
      content: "🚀 GUARANTEED 500% RETURNS IN 30 DAYS! 🚀\n\nJoin our exclusive WhatsApp group for insider trading tips! No risk, only profits!\n\nContact: +91-9876543210\nLimited time offer - Act NOW!"
    },
    {
      title: "Fake SEBI Advisor",
      content: "I am a SEBI registered investment advisor with 20 years experience. Get guaranteed IPO allotments with 100% profit guarantee. Send money to my personal account for instant processing."
    },
    {
      title: "Pump and Dump Scheme",
      content: "🔥 HOT TIP: XYZ stock will double tomorrow! Buy now before 10 AM. Target price 500. Book 100% profit. Join our Telegram channel for more such tips. Hurry!"
    }
  ];

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await axios.post('/api/fraud-detection/analyze-text', {
        content: content.trim(),
        source: source || 'manual_input'
      });

      setAnalysis(response.data.data);
      toast.success('Analysis completed successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Analysis failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleContent = (sample) => {
    setContent(sample.content);
    setSource('sample_data');
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
    if (score >= 40) return <Info color="info" />;
    return <CheckCircle color="success" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Fraud Detection Engine
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze text content for fraudulent patterns and suspicious activities
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Analysis
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                label="Enter content to analyze"
                placeholder="Paste investment advice, social media posts, emails, or any suspicious content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                variant="outlined"
                label="Source (optional)"
                placeholder="e.g., WhatsApp, Telegram, Email, Website"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                sx={{ mb: 2 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
                  onClick={handleAnalyze}
                  disabled={loading || !content.trim()}
                  size="large"
                >
                  {loading ? 'Analyzing...' : 'Analyze Content'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ContentPaste />}
                  onClick={() => {
                    navigator.clipboard.readText().then(text => {
                      setContent(text);
                      setSource('clipboard');
                    });
                  }}
                >
                  Paste from Clipboard
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Results
                </Typography>

                {/* Risk Score */}
                <Box mb={3}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {getRiskIcon(analysis.riskScore)}
                    <Typography variant="h5">
                      Risk Score: {analysis.riskScore}/100
                    </Typography>
                    <Chip
                      label={analysis.riskLevel}
                      color={getRiskColor(analysis.riskScore)}
                      variant="filled"
                    />
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={analysis.riskScore}
                    color={getRiskColor(analysis.riskScore)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {analysis.riskScore >= 80 && "🚨 CRITICAL: High probability of fraud - Avoid immediately"}
                    {analysis.riskScore >= 60 && analysis.riskScore < 80 && "⚠️ HIGH RISK: Exercise extreme caution"}
                    {analysis.riskScore >= 40 && analysis.riskScore < 60 && "⚡ MEDIUM RISK: Verify independently"}
                    {analysis.riskScore < 40 && "✅ LOW RISK: Relatively safe but stay vigilant"}
                  </Typography>
                </Box>

                {/* Suspicious Elements */}
                {analysis.suspiciousElements && analysis.suspiciousElements.length > 0 && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">
                        Suspicious Elements ({analysis.suspiciousElements.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {analysis.suspiciousElements.map((element, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemIcon>
                                <Warning color={getSeverityColor(element.severity)} />
                              </ListItemIcon>
                              <ListItemText
                                primary={element.type.replace('_', ' ')}
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {element.value}
                                    </Typography>
                                    <Chip
                                      label={element.severity}
                                      color={getSeverityColor(element.severity)}
                                      size="small"
                                      sx={{ mt: 1 }}
                                    />
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < analysis.suspiciousElements.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">
                        Safety Recommendations
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {analysis.recommendations.map((recommendation, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Security color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={recommendation} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sample Content & Tips */}
        <Grid item xs={12} md={4}>
          {/* Sample Content */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Try Sample Content
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test the fraud detection engine with these examples
              </Typography>
              
              {sampleContent.map((sample, index) => (
                <Paper
                  key={index}
                  sx={{ p: 2, mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleSampleContent(sample)}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {sample.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sample.content.substring(0, 100)}...
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>

          {/* Detection Tips */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fraud Detection Tips
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Guaranteed Returns"
                    secondary="Be wary of promises of guaranteed high returns"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Error color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Urgency Tactics"
                    secondary="Fraudsters create false urgency to pressure decisions"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Unregistered Advisors"
                    secondary="Always verify advisor credentials with SEBI"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Social Media Tips"
                    secondary="Avoid investment advice from social media groups"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detection Statistics
              </Typography>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2">Accuracy Rate</Typography>
                <Typography variant="h6" color="success.main">94.2%</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2">Content Analyzed</Typography>
                <Typography variant="h6">15.7K</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Frauds Prevented</Typography>
                <Typography variant="h6" color="error.main">1,247</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FraudDetection;