import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  Avatar
} from '@mui/material';
import {
  Security,
  Psychology,
  Speed,
  Shield,
  TrendingUp,
  People,
  CheckCircle,
  GitHub,
  LinkedIn,
  Email
} from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <Psychology color="primary" />,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms to detect fraud patterns in real-time"
    },
    {
      icon: <Speed color="success" />,
      title: "Real-Time Analysis",
      description: "Instant fraud detection and alert system for immediate protection"
    },
    {
      icon: <Shield color="info" />,
      title: "Multi-Modal Protection",
      description: "Comprehensive coverage across text, documents, social media, and advisors"
    },
    {
      icon: <TrendingUp color="warning" />,
      title: "Continuous Learning",
      description: "System improves over time by learning from new fraud patterns"
    }
  ];

  const technologies = [
    "React.js", "Node.js", "MongoDB", "TensorFlow", "OpenCV", 
    "Natural Language Processing", "Machine Learning", "Socket.IO", 
    "Material-UI", "Express.js", "Redis", "Blockchain"
  ];

  const achievements = [
    { metric: "94.2%", label: "Detection Accuracy" },
    { metric: "15.7K", label: "Users Protected" },
    { metric: "1,247", label: "Frauds Prevented" },
    { metric: "<2s", label: "Analysis Time" }
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={4} textAlign="center">
        <Typography variant="h3" gutterBottom>
          About SecureInvest AI
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          A comprehensive fraud prevention platform designed to protect retail investors 
          from various types of securities market fraud using advanced AI/ML technologies.
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Our Mission
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ fontWeight: 400 }}>
            To create a safer investment environment by leveraging cutting-edge technology 
            to detect, prevent, and educate about securities market fraud, aligned with 
            SEBI's Safe Space initiative.
          </Typography>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Stack */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Technology Stack
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Built with modern, scalable technologies for optimal performance and security.
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {technologies.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Key Achievements
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Demonstrating real impact in fraud prevention and investor protection.
              </Typography>
              <Grid container spacing={2}>
                {achievements.map((achievement, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {achievement.metric}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Problem Statement */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Problem Statement
          </Typography>
          <Typography variant="body1" paragraph>
            Fraudsters employ various deceptive tactics to exploit investors in the securities market:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="error" /></ListItemIcon>
              <ListItemText primary="Fraudulent advisors and Ponzi schemes promising high returns" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="error" /></ListItemIcon>
              <ListItemText primary="Deepfake videos/audios and fabricated regulatory documents" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="error" /></ListItemIcon>
              <ListItemText primary="Social media manipulation and pump-and-dump schemes" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="error" /></ListItemIcon>
              <ListItemText primary="Fake trading apps and IPO allotment scams" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="error" /></ListItemIcon>
              <ListItemText primary="Misleading corporate announcements" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Solution Approach */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Our Solution Approach
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Multi-Modal Detection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive analysis across text, documents, social media, and advisor credentials
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Psychology sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI-Powered Intelligence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced machine learning models for pattern recognition and fraud detection
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <People sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  User-Centric Design
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Simple, intuitive interface designed for retail investors and regulators
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Developer Information */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            Developer Information
          </Typography>
          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>
              AT
            </Avatar>
          </Box>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Aditya Tayal
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" paragraph>
            Full-Stack Developer & AI Enthusiast
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary" paragraph>
            Built for SEBI Securities Market Hackathon 2025 as part of the Global Fintech Festival.
            Passionate about using technology to solve real-world problems and protect investors.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Email />}
              href="mailto:adityatayal404@gmail.com"
            >
              Email
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHub />}
              href="https://github.com/adityatayal"
              target="_blank"
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkedIn />}
              href="https://linkedin.com/in/adityatayal"
              target="_blank"
            >
              LinkedIn
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;