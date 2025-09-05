import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Security,
  Warning,
  TrendingUp,
  People,
  Assessment,
  Refresh,
  Shield,
  Error,
  CheckCircle,
  Info,
  Notifications,
  Timeline
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for demonstration
const mockStats = {
  totalAlerts: 1247,
  criticalAlerts: 89,
  highRiskAlerts: 234,
  mediumRiskAlerts: 456,
  lowRiskAlerts: 468,
  alertsByType: {
    'TEXT_ANALYSIS': 345,
    'SOCIAL_MEDIA': 289,
    'ADVISOR_VERIFICATION': 234,
    'CORPORATE_ANNOUNCEMENT': 189,
    'DOCUMENT_VERIFICATION': 123,
    'DEEPFAKE_DETECTION': 67
  }
};

const mockRecentAlerts = [
  {
    id: 1,
    type: 'SOCIAL_MEDIA',
    riskScore: 85,
    content: 'Guaranteed 500% returns in crypto trading...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    source: 'WhatsApp Group'
  },
  {
    id: 2,
    type: 'ADVISOR_VERIFICATION',
    riskScore: 92,
    content: 'Unregistered advisor promising IPO allotments...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    source: 'Telegram Channel'
  },
  {
    id: 3,
    type: 'DOCUMENT_VERIFICATION',
    riskScore: 78,
    content: 'Suspicious SEBI approval letter detected...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    source: 'Email Attachment'
  },
  {
    id: 4,
    type: 'CORPORATE_ANNOUNCEMENT',
    riskScore: 65,
    content: 'Unusual merger announcement timing...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    source: 'Company Website'
  }
];

const pieChartData = [
  { name: 'Critical', value: 89, color: '#f44336' },
  { name: 'High', value: 234, color: '#ff9800' },
  { name: 'Medium', value: 456, color: '#2196f3' },
  { name: 'Low', value: 468, color: '#4caf50' }
];

const trendData = [
  { name: 'Mon', alerts: 45, resolved: 38 },
  { name: 'Tue', alerts: 52, resolved: 41 },
  { name: 'Wed', alerts: 38, resolved: 35 },
  { name: 'Thu', alerts: 67, resolved: 52 },
  { name: 'Fri', alerts: 89, resolved: 71 },
  { name: 'Sat', alerts: 34, resolved: 28 },
  { name: 'Sun', alerts: 28, resolved: 25 }
];

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [recentAlerts, setRecentAlerts] = useState(mockRecentAlerts);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Security Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time fraud detection and prevention insights
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Alert Banner */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>89 critical alerts</strong> require immediate attention. 
          <Button size="small" sx={{ ml: 1 }}>View All</Button>
        </Typography>
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Alerts
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalAlerts.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% from last week
                  </Typography>
                </Box>
                <Security color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Critical Alerts
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.criticalAlerts}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    Needs attention
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Detection Rate
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    94.2%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +2.1% improvement
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Protected Users
                  </Typography>
                  <Typography variant="h4">
                    15.7K
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    Active this month
                  </Typography>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Risk Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mt={2}>
                {pieChartData.map((item) => (
                  <Chip
                    key={item.name}
                    label={`${item.name}: ${item.value}`}
                    sx={{ backgroundColor: item.color, color: 'white' }}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Alert Trend
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="alerts" 
                      stroke="#f44336" 
                      strokeWidth={2}
                      name="New Alerts"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#4caf50" 
                      strokeWidth={2}
                      name="Resolved"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent High-Risk Alerts
                </Typography>
                <Button size="small" endIcon={<Notifications />}>
                  View All
                </Button>
              </Box>
              <List>
                {recentAlerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getRiskIcon(alert.riskScore)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">
                              {alert.content.substring(0, 50)}...
                            </Typography>
                            <Chip
                              label={`${alert.riskScore}%`}
                              color={getRiskColor(alert.riskScore)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              {alert.source} • {alert.type.replace('_', ' ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatTimeAgo(alert.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentAlerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Security />}
                  fullWidth
                  href="/fraud-detection"
                >
                  Analyze Content
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Shield />}
                  fullWidth
                  href="/advisor-verification"
                >
                  Verify Advisor
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  fullWidth
                  href="/document-verification"
                >
                  Check Document
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Timeline />}
                  fullWidth
                  href="/analytics"
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">AI Detection Engine</Typography>
                    <Typography variant="body2" color="success.main">Online</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={98} color="success" />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Social Media Monitor</Typography>
                    <Typography variant="body2" color="success.main">Active</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={95} color="success" />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Document Verification</Typography>
                    <Typography variant="body2" color="warning.main">Maintenance</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={75} color="warning" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;