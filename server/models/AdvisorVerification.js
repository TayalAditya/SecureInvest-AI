const mongoose = require('mongoose');

const advisorVerificationSchema = new mongoose.Schema({
  advisorName: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String,
    address: String
  },
  sebiDetails: {
    registrationType: {
      type: String,
      enum: ['INVESTMENT_ADVISOR', 'RESEARCH_ANALYST', 'BROKER', 'PORTFOLIO_MANAGER', 'OTHER']
    },
    registrationDate: Date,
    validUntil: Date,
    category: String,
    services: [String]
  },
  isRegistered: {
    type: Boolean,
    required: true
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
  issues: [{
    type: {
      type: String,
      enum: [
        'NOT_REGISTERED',
        'EXPIRED_REGISTRATION',
        'SUSPENDED_REGISTRATION',
        'UNREALISTIC_PROMISES',
        'SUSPICIOUS_CONTACT',
        'FAKE_CREDENTIALS',
        'MISLEADING_CLAIMS',
        'UNAUTHORIZED_SERVICES'
      ]
    },
    message: String,
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    evidence: String
  }],
  verificationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  verificationSource: {
    type: String,
    enum: ['SEBI_API', 'MANUAL_CHECK', 'THIRD_PARTY', 'USER_REPORT'],
    default: 'SEBI_API'
  },
  additionalData: {
    promisedReturns: Number,
    contactMethods: [String],
    socialMediaPresence: [{
      platform: String,
      handle: String,
      verified: Boolean
    }],
    clientTestimonials: [{
      rating: Number,
      comment: String,
      date: Date,
      verified: Boolean
    }]
  },
  status: {
    type: String,
    enum: ['VERIFIED', 'UNVERIFIED', 'SUSPICIOUS', 'BLACKLISTED', 'UNDER_REVIEW'],
    default: function() {
      if (!this.isRegistered) return 'UNVERIFIED';
      if (this.riskScore >= 80) return 'SUSPICIOUS';
      return 'VERIFIED';
    }
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportDate: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  actionsTaken: [{
    action: {
      type: String,
      enum: ['WARNING_ISSUED', 'INVESTIGATION_STARTED', 'REPORTED_TO_SEBI', 'BLACKLISTED', 'CLEARED']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes
advisorVerificationSchema.index({ registrationNumber: 1 }, { unique: true });
advisorVerificationSchema.index({ advisorName: 1 });
advisorVerificationSchema.index({ riskScore: -1 });
advisorVerificationSchema.index({ status: 1 });
advisorVerificationSchema.index({ verificationDate: -1 });

// Virtual for verification age
advisorVerificationSchema.virtual('verificationAge').get(function() {
  return Date.now() - this.verificationDate;
});

// Virtual for needs reverification
advisorVerificationSchema.virtual('needsReverification').get(function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.verificationDate < thirtyDaysAgo;
});

// Method to add issue
advisorVerificationSchema.methods.addIssue = function(issueData) {
  this.issues.push(issueData);
  this.riskScore = Math.min(this.riskScore + 20, 100);
  this.lastUpdated = new Date();
  return this.save();
};

// Method to update status
advisorVerificationSchema.methods.updateStatus = function(newStatus, actionData) {
  this.status = newStatus;
  if (actionData) {
    this.actionsTaken.push(actionData);
  }
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to find by registration number
advisorVerificationSchema.statics.findByRegistration = function(registrationNumber) {
  return this.findOne({ registrationNumber: registrationNumber.toUpperCase() });
};

// Static method to get suspicious advisors
advisorVerificationSchema.statics.getSuspiciousAdvisors = function(limit = 10) {
  return this.find({ 
    $or: [
      { status: 'SUSPICIOUS' },
      { riskScore: { $gte: 60 } }
    ]
  })
  .sort({ riskScore: -1, verificationDate: -1 })
  .limit(limit);
};

// Static method to get verification statistics
advisorVerificationSchema.statics.getVerificationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalVerifications: { $sum: 1 },
        registeredAdvisors: {
          $sum: { $cond: ['$isRegistered', 1, 0] }
        },
        unregisteredAdvisors: {
          $sum: { $cond: ['$isRegistered', 0, 1] }
        },
        suspiciousAdvisors: {
          $sum: { $cond: [{ $eq: ['$status', 'SUSPICIOUS'] }, 1, 0] }
        },
        avgRiskScore: { $avg: '$riskScore' }
      }
    }
  ]);
};

// Pre-save middleware to update risk level
advisorVerificationSchema.pre('save', function(next) {
  if (this.riskScore >= 80) this.riskLevel = 'CRITICAL';
  else if (this.riskScore >= 60) this.riskLevel = 'HIGH';
  else if (this.riskScore >= 40) this.riskLevel = 'MEDIUM';
  else if (this.riskScore >= 20) this.riskLevel = 'LOW';
  else this.riskLevel = 'MINIMAL';
  
  next();
});

module.exports = mongoose.model('AdvisorVerification', advisorVerificationSchema);