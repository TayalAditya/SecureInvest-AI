const mongoose = require('mongoose');

const fraudAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'TEXT_ANALYSIS',
      'SOCIAL_MEDIA',
      'ADVISOR_VERIFICATION',
      'CORPORATE_ANNOUNCEMENT',
      'DEEPFAKE_DETECTION',
      'DOCUMENT_VERIFICATION',
      'MARKET_MANIPULATION'
    ]
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: function() {
      if (this.riskScore >= 80) return 'CRITICAL';
      if (this.riskScore >= 60) return 'HIGH';
      if (this.riskScore >= 40) return 'MEDIUM';
      if (this.riskScore >= 20) return 'LOW';
      return 'MINIMAL';
    }
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  source: {
    type: String,
    required: true
  },
  analysis: {
    suspiciousElements: [{
      type: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: true
      }
    }],
    recommendations: [String],
    riskScore: Number,
    riskLevel: String,
    source: String,
    timestamp: Date,
    additionalData: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED', 'FALSE_POSITIVE', 'UNDER_REVIEW'],
    default: 'ACTIVE'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  actionTaken: String,
  relatedAlerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FraudAlert'
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      state: String,
      city: String
    },
    platform: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
fraudAlertSchema.index({ type: 1, createdAt: -1 });
fraudAlertSchema.index({ riskScore: -1 });
fraudAlertSchema.index({ status: 1 });
fraudAlertSchema.index({ source: 1 });

// Virtual for risk level calculation
fraudAlertSchema.virtual('calculatedRiskLevel').get(function() {
  if (this.riskScore >= 80) return 'CRITICAL';
  if (this.riskScore >= 60) return 'HIGH';
  if (this.riskScore >= 40) return 'MEDIUM';
  if (this.riskScore >= 20) return 'LOW';
  return 'MINIMAL';
});

// Method to update status
fraudAlertSchema.methods.updateStatus = function(newStatus, reviewerId, notes) {
  this.status = newStatus;
  this.reviewedBy = reviewerId;
  this.reviewNotes = notes;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get alerts by risk level
fraudAlertSchema.statics.getByRiskLevel = function(riskLevel, limit = 10) {
  const scoreRanges = {
    'CRITICAL': { $gte: 80 },
    'HIGH': { $gte: 60, $lt: 80 },
    'MEDIUM': { $gte: 40, $lt: 60 },
    'LOW': { $gte: 20, $lt: 40 },
    'MINIMAL': { $lt: 20 }
  };

  return this.find({ riskScore: scoreRanges[riskLevel] })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get statistics
fraudAlertSchema.statics.getStatistics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalAlerts: { $sum: 1 },
        avgRiskScore: { $avg: '$riskScore' },
        criticalAlerts: {
          $sum: { $cond: [{ $gte: ['$riskScore', 80] }, 1, 0] }
        },
        highRiskAlerts: {
          $sum: { 
            $cond: [
              { $and: [{ $gte: ['$riskScore', 60] }, { $lt: ['$riskScore', 80] }] }, 
              1, 
              0
            ] 
          }
        },
        mediumRiskAlerts: {
          $sum: { 
            $cond: [
              { $and: [{ $gte: ['$riskScore', 40] }, { $lt: ['$riskScore', 60] }] }, 
              1, 
              0
            ] 
          }
        },
        lowRiskAlerts: {
          $sum: { $cond: [{ $lt: ['$riskScore', 40] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('FraudAlert', fraudAlertSchema);