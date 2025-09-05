const express = require('express');
const multer = require('multer');
const path = require('path');
const fraudDetectionService = require('../services/fraudDetectionService');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

/**
 * @route POST /api/fraud-detection/analyze-text
 * @desc Analyze text content for fraud patterns
 * @access Public
 */
router.post('/analyze-text', async (req, res) => {
  try {
    const { content, source } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const analysis = await fraudDetectionService.analyzeTextContent(content, source);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('Error in text analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/fraud-detection/analyze-social-media
 * @desc Analyze social media post for manipulation patterns
 * @access Public
 */
router.post('/analyze-social-media', async (req, res) => {
  try {
    const postData = req.body;

    if (!postData.content) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    const analysis = await fraudDetectionService.analyzeSocialMediaPost(postData);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('Error in social media analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/fraud-detection/verify-advisor
 * @desc Verify advisor credentials against SEBI database
 * @access Public
 */
router.post('/verify-advisor', async (req, res) => {
  try {
    const advisorData = req.body;

    if (!advisorData.name || !advisorData.registrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Advisor name and registration number are required'
      });
    }

    const verification = await fraudDetectionService.verifyAdvisor(advisorData);

    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    logger.error('Error in advisor verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/fraud-detection/analyze-announcement
 * @desc Analyze corporate announcement for authenticity
 * @access Public
 */
router.post('/analyze-announcement', async (req, res) => {
  try {
    const announcement = req.body;

    if (!announcement.content) {
      return res.status(400).json({
        success: false,
        message: 'Announcement content is required'
      });
    }

    const analysis = await fraudDetectionService.analyzeCorporateAnnouncement(announcement);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('Error in announcement analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/fraud-detection/analyze-document
 * @desc Analyze uploaded document for fraud indicators
 * @access Public
 */
router.post('/analyze-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Document file is required'
      });
    }

    // For now, we'll simulate document analysis
    // In a real implementation, this would use OCR and document verification services
    const documentAnalysis = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      riskScore: Math.floor(Math.random() * 100),
      analysis: {
        documentType: 'REGULATORY_LETTER',
        isAuthentic: Math.random() > 0.3,
        suspiciousElements: [
          {
            type: 'FORMATTING_INCONSISTENCY',
            value: 'Unusual font usage detected',
            severity: 'MEDIUM'
          }
        ],
        recommendations: [
          'Verify document authenticity with issuing authority',
          'Check official website for similar documents'
        ]
      }
    };

    documentAnalysis.riskLevel = fraudDetectionService.getRiskLevel(documentAnalysis.riskScore);

    res.json({
      success: true,
      data: documentAnalysis
    });
  } catch (error) {
    logger.error('Error in document analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/fraud-detection/statistics
 * @desc Get fraud detection statistics
 * @access Private (Admin/Regulator)
 */
router.get('/statistics', auth, async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    const statistics = await fraudDetectionService.getFraudStatistics(timeframe);

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    logger.error('Error getting fraud statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/fraud-detection/alerts
 * @desc Get fraud alerts with pagination
 * @access Private
 */
router.get('/alerts', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      riskLevel,
      type,
      status = 'ACTIVE'
    } = req.query;

    const FraudAlert = require('../models/FraudAlert');
    
    const query = { status };
    
    if (riskLevel) {
      const scoreRanges = {
        'CRITICAL': { $gte: 80 },
        'HIGH': { $gte: 60, $lt: 80 },
        'MEDIUM': { $gte: 40, $lt: 60 },
        'LOW': { $gte: 20, $lt: 40 },
        'MINIMAL': { $lt: 20 }
      };
      query.riskScore = scoreRanges[riskLevel];
    }
    
    if (type) {
      query.type = type;
    }

    const alerts = await FraudAlert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reportedBy', 'name email')
      .populate('reviewedBy', 'name email');

    const total = await FraudAlert.countDocuments(query);

    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    logger.error('Error getting fraud alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route PUT /api/fraud-detection/alerts/:id/status
 * @desc Update fraud alert status
 * @access Private (Admin/Regulator)
 */
router.put('/alerts/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['ACTIVE', 'RESOLVED', 'FALSE_POSITIVE', 'UNDER_REVIEW'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const FraudAlert = require('../models/FraudAlert');
    const alert = await FraudAlert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.updateStatus(status, req.user.id, notes);

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    logger.error('Error updating alert status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/fraud-detection/report
 * @desc Report suspicious activity
 * @access Public
 */
router.post('/report', async (req, res) => {
  try {
    const {
      type,
      description,
      url,
      contactInfo,
      additionalDetails
    } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type and description are required'
      });
    }

    // Analyze the reported content
    const analysis = await fraudDetectionService.analyzeTextContent(description, 'user_report');

    // Create fraud alert
    const alert = await fraudDetectionService.createFraudAlert({
      type: 'USER_REPORT',
      riskScore: analysis.riskScore,
      content: description,
      source: 'user_report',
      analysis: {
        ...analysis,
        reportDetails: {
          type,
          url,
          contactInfo,
          additionalDetails
        }
      }
    });

    res.json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        reportId: alert._id,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel
      }
    });
  } catch (error) {
    logger.error('Error submitting report:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;