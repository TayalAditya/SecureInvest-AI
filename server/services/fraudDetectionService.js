const axios = require('axios');
const logger = require('../utils/logger');
const FraudAlert = require('../models/FraudAlert');
const SocialMediaPost = require('../models/SocialMediaPost');
const AdvisorVerification = require('../models/AdvisorVerification');

class FraudDetectionService {
  constructor() {
    this.suspiciousKeywords = [
      'guaranteed returns', 'risk-free investment', 'double your money',
      'insider information', 'hot tip', 'sure shot', 'limited time offer',
      'exclusive deal', 'secret formula', 'get rich quick', 'no risk',
      'instant profit', 'guaranteed profit', 'easy money', 'quick money'
    ];
    
    this.manipulationPatterns = [
      /buy\s+now/gi,
      /sell\s+immediately/gi,
      /target\s+price\s+\d+/gi,
      /book\s+profit/gi,
      /stop\s+loss/gi,
      /breakout\s+expected/gi
    ];
  }

  /**
   * Analyze text content for fraudulent patterns
   */
  async analyzeTextContent(content, source = 'unknown') {
    try {
      const riskScore = this.calculateTextRiskScore(content);
      const suspiciousElements = this.identifySuspiciousElements(content);
      
      const analysis = {
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        suspiciousElements,
        source,
        timestamp: new Date(),
        recommendations: this.generateRecommendations(riskScore, suspiciousElements)
      };

      // Log high-risk content
      if (riskScore > 70) {
        logger.warn(`High-risk content detected from ${source}:`, {
          riskScore,
          suspiciousElements: suspiciousElements.length,
          content: content.substring(0, 200)
        });
        
        // Create fraud alert
        await this.createFraudAlert({
          type: 'TEXT_ANALYSIS',
          riskScore,
          content: content.substring(0, 500),
          source,
          analysis
        });
      }

      return analysis;
    } catch (error) {
      logger.error('Error in text content analysis:', error);
      throw error;
    }
  }

  /**
   * Calculate risk score based on text content
   */
  calculateTextRiskScore(content) {
    let score = 0;
    const lowerContent = content.toLowerCase();

    // Check for suspicious keywords
    this.suspiciousKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        score += 15;
      }
    });

    // Check for manipulation patterns
    this.manipulationPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        score += 10;
      }
    });

    // Check for urgency indicators
    const urgencyWords = ['urgent', 'hurry', 'limited time', 'act now', 'today only'];
    urgencyWords.forEach(word => {
      if (lowerContent.includes(word)) {
        score += 8;
      }
    });

    // Check for unrealistic promises
    const unrealisticPatterns = [
      /\d+%\s+return/gi,
      /\d+x\s+return/gi,
      /\d+\s+times\s+profit/gi
    ];
    
    unrealisticPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const number = parseInt(match.match(/\d+/)[0]);
          if (number > 50) score += 20; // Very high returns
          else if (number > 20) score += 15; // High returns
          else if (number > 10) score += 10; // Moderate returns
        });
      }
    });

    // Check for contact information patterns (phone, email, WhatsApp)
    const contactPatterns = [
      /whatsapp/gi,
      /telegram/gi,
      /\+\d{10,}/g,
      /\d{10}/g,
      /contact\s+me/gi
    ];
    
    contactPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        score += 12;
      }
    });

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Identify specific suspicious elements in content
   */
  identifySuspiciousElements(content) {
    const elements = [];
    const lowerContent = content.toLowerCase();

    // Suspicious keywords
    this.suspiciousKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        elements.push({
          type: 'SUSPICIOUS_KEYWORD',
          value: keyword,
          severity: 'HIGH'
        });
      }
    });

    // Unrealistic returns
    const returnMatches = content.match(/\d+%\s+return/gi);
    if (returnMatches) {
      returnMatches.forEach(match => {
        const percentage = parseInt(match.match(/\d+/)[0]);
        if (percentage > 20) {
          elements.push({
            type: 'UNREALISTIC_RETURN',
            value: match,
            severity: percentage > 50 ? 'CRITICAL' : 'HIGH'
          });
        }
      });
    }

    // Contact information
    const phoneMatches = content.match(/\+?\d{10,}/g);
    if (phoneMatches) {
      elements.push({
        type: 'CONTACT_INFO',
        value: 'Phone number detected',
        severity: 'MEDIUM'
      });
    }

    // Social media mentions
    if (/whatsapp|telegram/gi.test(content)) {
      elements.push({
        type: 'SOCIAL_MEDIA_CONTACT',
        value: 'Social media contact detected',
        severity: 'HIGH'
      });
    }

    return elements;
  }

  /**
   * Analyze social media post for manipulation patterns
   */
  async analyzeSocialMediaPost(postData) {
    try {
      const textAnalysis = await this.analyzeTextContent(postData.content, 'social_media');
      
      // Additional social media specific checks
      let socialMediaScore = 0;
      
      // Check engagement patterns
      if (postData.likes && postData.shares) {
        const engagementRatio = postData.shares / postData.likes;
        if (engagementRatio > 0.5) {
          socialMediaScore += 15; // Unusual sharing pattern
        }
      }

      // Check posting frequency
      if (postData.authorPostCount && postData.authorPostCount > 10) {
        socialMediaScore += 10; // High frequency posting
      }

      // Check for group coordination
      if (postData.isFromGroup && postData.groupSize > 100) {
        socialMediaScore += 20; // Large group activity
      }

      const finalScore = Math.min(textAnalysis.riskScore + socialMediaScore, 100);
      
      // Save social media post analysis
      const socialMediaPost = new SocialMediaPost({
        platform: postData.platform,
        postId: postData.postId,
        content: postData.content,
        author: postData.author,
        riskScore: finalScore,
        analysis: {
          ...textAnalysis,
          socialMediaScore,
          finalScore
        },
        timestamp: new Date()
      });
      
      await socialMediaPost.save();

      return {
        ...textAnalysis,
        riskScore: finalScore,
        socialMediaScore,
        postId: socialMediaPost._id
      };
    } catch (error) {
      logger.error('Error analyzing social media post:', error);
      throw error;
    }
  }

  /**
   * Verify advisor credentials against SEBI database
   */
  async verifyAdvisor(advisorData) {
    try {
      // Simulate SEBI database check (in real implementation, this would call SEBI API)
      const isRegistered = await this.checkSEBIDatabase(advisorData);
      
      let riskScore = 0;
      const issues = [];

      if (!isRegistered) {
        riskScore += 50;
        issues.push({
          type: 'NOT_REGISTERED',
          message: 'Advisor not found in SEBI registered database',
          severity: 'CRITICAL'
        });
      }

      // Check for suspicious patterns in advisor profile
      if (advisorData.promisedReturns && advisorData.promisedReturns > 20) {
        riskScore += 30;
        issues.push({
          type: 'UNREALISTIC_PROMISES',
          message: `Promising ${advisorData.promisedReturns}% returns`,
          severity: 'HIGH'
        });
      }

      // Check contact methods
      if (advisorData.contactMethods && 
          (advisorData.contactMethods.includes('whatsapp') || 
           advisorData.contactMethods.includes('telegram'))) {
        riskScore += 20;
        issues.push({
          type: 'SUSPICIOUS_CONTACT',
          message: 'Using social media for professional communication',
          severity: 'MEDIUM'
        });
      }

      const verification = new AdvisorVerification({
        advisorName: advisorData.name,
        registrationNumber: advisorData.registrationNumber,
        isRegistered,
        riskScore,
        issues,
        verificationDate: new Date()
      });

      await verification.save();

      return {
        isRegistered,
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        issues,
        verificationId: verification._id,
        recommendations: this.generateAdvisorRecommendations(riskScore, issues)
      };
    } catch (error) {
      logger.error('Error verifying advisor:', error);
      throw error;
    }
  }

  /**
   * Simulate SEBI database check
   */
  async checkSEBIDatabase(advisorData) {
    // In real implementation, this would call SEBI's API
    // For demo purposes, we'll simulate some registered advisors
    const registeredAdvisors = [
      'JOHN_DOE_IA_001',
      'JANE_SMITH_RA_002',
      'AMIT_KUMAR_IB_003',
      'PRIYA_SHARMA_IA_004'
    ];

    return registeredAdvisors.includes(advisorData.registrationNumber);
  }

  /**
   * Analyze corporate announcement for authenticity
   */
  async analyzeCorporateAnnouncement(announcement) {
    try {
      let riskScore = 0;
      const issues = [];

      // Check for unusual timing
      const now = new Date();
      const announcementTime = new Date(announcement.timestamp);
      const hour = announcementTime.getHours();
      
      if (hour < 9 || hour > 17) {
        riskScore += 15;
        issues.push({
          type: 'UNUSUAL_TIMING',
          message: 'Announcement made outside market hours',
          severity: 'MEDIUM'
        });
      }

      // Check for suspicious content patterns
      const textAnalysis = await this.analyzeTextContent(announcement.content, 'corporate_announcement');
      riskScore += textAnalysis.riskScore * 0.5; // Weight corporate announcements differently

      // Check for historical inconsistencies
      if (announcement.claimedGrowth && announcement.claimedGrowth > 100) {
        riskScore += 25;
        issues.push({
          type: 'UNREALISTIC_GROWTH',
          message: `Claimed growth of ${announcement.claimedGrowth}% seems unrealistic`,
          severity: 'HIGH'
        });
      }

      // Verify against exchange data (simulated)
      const isVerified = await this.verifyWithExchange(announcement);
      if (!isVerified) {
        riskScore += 40;
        issues.push({
          type: 'NOT_VERIFIED',
          message: 'Announcement not found in official exchange records',
          severity: 'CRITICAL'
        });
      }

      return {
        riskScore: Math.min(riskScore, 100),
        riskLevel: this.getRiskLevel(riskScore),
        issues,
        isVerified,
        textAnalysis,
        recommendations: this.generateAnnouncementRecommendations(riskScore, issues)
      };
    } catch (error) {
      logger.error('Error analyzing corporate announcement:', error);
      throw error;
    }
  }

  /**
   * Simulate exchange verification
   */
  async verifyWithExchange(announcement) {
    // In real implementation, this would check with BSE/NSE APIs
    // For demo, we'll simulate some verification logic
    return Math.random() > 0.3; // 70% chance of being verified
  }

  /**
   * Get risk level based on score
   */
  getRiskLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'MINIMAL';
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(riskScore, suspiciousElements) {
    const recommendations = [];

    if (riskScore > 70) {
      recommendations.push('⚠️ HIGH RISK: Avoid this investment opportunity');
      recommendations.push('🔍 Verify all claims independently');
      recommendations.push('📞 Contact SEBI investor helpline if needed');
    } else if (riskScore > 40) {
      recommendations.push('⚡ MEDIUM RISK: Exercise caution');
      recommendations.push('🔍 Conduct thorough due diligence');
      recommendations.push('💼 Consult with registered financial advisor');
    } else {
      recommendations.push('✅ Relatively safe, but always verify');
      recommendations.push('📚 Continue learning about investment risks');
    }

    // Specific recommendations based on suspicious elements
    suspiciousElements.forEach(element => {
      switch (element.type) {
        case 'UNREALISTIC_RETURN':
          recommendations.push('📈 Be skeptical of guaranteed high returns');
          break;
        case 'CONTACT_INFO':
          recommendations.push('📱 Verify advisor credentials before sharing contact');
          break;
        case 'SOCIAL_MEDIA_CONTACT':
          recommendations.push('🚫 Avoid investment advice from social media');
          break;
      }
    });

    return recommendations;
  }

  /**
   * Generate advisor-specific recommendations
   */
  generateAdvisorRecommendations(riskScore, issues) {
    const recommendations = [];

    if (riskScore > 50) {
      recommendations.push('🚨 WARNING: This advisor may not be legitimate');
      recommendations.push('✅ Only work with SEBI registered advisors');
      recommendations.push('📋 Check SEBI website for registered advisor list');
    }

    issues.forEach(issue => {
      switch (issue.type) {
        case 'NOT_REGISTERED':
          recommendations.push('🔍 Verify registration on SEBI website');
          break;
        case 'UNREALISTIC_PROMISES':
          recommendations.push('📊 Be wary of guaranteed return promises');
          break;
        case 'SUSPICIOUS_CONTACT':
          recommendations.push('💼 Professional advisors use official channels');
          break;
      }
    });

    return recommendations;
  }

  /**
   * Generate announcement-specific recommendations
   */
  generateAnnouncementRecommendations(riskScore, issues) {
    const recommendations = [];

    if (riskScore > 60) {
      recommendations.push('⚠️ This announcement may be fraudulent');
      recommendations.push('🔍 Verify on official exchange website');
      recommendations.push('📰 Check multiple news sources');
    }

    issues.forEach(issue => {
      switch (issue.type) {
        case 'NOT_VERIFIED':
          recommendations.push('✅ Check BSE/NSE official announcements');
          break;
        case 'UNREALISTIC_GROWTH':
          recommendations.push('📊 Compare with industry benchmarks');
          break;
        case 'UNUSUAL_TIMING':
          recommendations.push('⏰ Verify timing with exchange records');
          break;
      }
    });

    return recommendations;
  }

  /**
   * Create fraud alert
   */
  async createFraudAlert(alertData) {
    try {
      const alert = new FraudAlert({
        type: alertData.type,
        riskScore: alertData.riskScore,
        content: alertData.content,
        source: alertData.source,
        analysis: alertData.analysis,
        status: 'ACTIVE',
        createdAt: new Date()
      });

      await alert.save();
      
      // Emit real-time alert to connected clients
      const io = require('../index').get('io');
      if (io) {
        io.emit('fraud-alert', {
          id: alert._id,
          type: alert.type,
          riskScore: alert.riskScore,
          timestamp: alert.createdAt
        });
      }

      return alert;
    } catch (error) {
      logger.error('Error creating fraud alert:', error);
      throw error;
    }
  }

  /**
   * Get fraud statistics
   */
  async getFraudStatistics(timeframe = '7d') {
    try {
      const startDate = new Date();
      
      switch (timeframe) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const alerts = await FraudAlert.find({
        createdAt: { $gte: startDate }
      });

      const stats = {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.riskScore >= 80).length,
        highRiskAlerts: alerts.filter(a => a.riskScore >= 60 && a.riskScore < 80).length,
        mediumRiskAlerts: alerts.filter(a => a.riskScore >= 40 && a.riskScore < 60).length,
        lowRiskAlerts: alerts.filter(a => a.riskScore < 40).length,
        alertsByType: {},
        timeframe
      };

      // Group by type
      alerts.forEach(alert => {
        stats.alertsByType[alert.type] = (stats.alertsByType[alert.type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error getting fraud statistics:', error);
      throw error;
    }
  }
}

module.exports = new FraudDetectionService();