const mongoose = require('mongoose');

const socialMediaPostSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['WHATSAPP', 'TELEGRAM', 'TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'OTHER']
  },
  postId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  author: {
    username: String,
    displayName: String,
    profileUrl: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  engagement: {
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
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
  analysis: {
    suspiciousElements: [{
      type: String,
      value: String,
      severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
      }
    }],
    recommendations: [String],
    socialMediaScore: Number,
    textAnalysis: mongoose.Schema.Types.Mixed
  },
  metadata: {
    groupInfo: {
      groupName: String,
      groupSize: Number,
      isPrivate: Boolean
    },
    location: {
      country: String,
      state: String,
      city: String
    },
    deviceInfo: String,
    ipAddress: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED', 'FALSE_POSITIVE', 'UNDER_REVIEW'],
    default: 'ACTIVE'
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  actionTaken: {
    type: String,
    enum: ['NONE', 'WARNING_ISSUED', 'CONTENT_REMOVED', 'ACCOUNT_SUSPENDED', 'REPORTED_TO_AUTHORITIES'],
    default: 'NONE'
  }
}, {
  timestamps: true
});

// Indexes
socialMediaPostSchema.index({ platform: 1, postId: 1 }, { unique: true });
socialMediaPostSchema.index({ riskScore: -1 });
socialMediaPostSchema.index({ createdAt: -1 });
socialMediaPostSchema.index({ status: 1 });

// Virtual for engagement rate
socialMediaPostSchema.virtual('engagementRate').get(function() {
  if (this.engagement.views === 0) return 0;
  const totalEngagement = this.engagement.likes + this.engagement.shares + this.engagement.comments;
  return (totalEngagement / this.engagement.views) * 100;
});

// Method to update status
socialMediaPostSchema.methods.updateStatus = function(newStatus, actionTaken) {
  this.status = newStatus;
  if (actionTaken) {
    this.actionTaken = actionTaken;
  }
  return this.save();
};

// Static method to get posts by platform
socialMediaPostSchema.statics.getByPlatform = function(platform, limit = 10) {
  return this.find({ platform })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get high-risk posts
socialMediaPostSchema.statics.getHighRiskPosts = function(minRiskScore = 60, limit = 10) {
  return this.find({ riskScore: { $gte: minRiskScore } })
    .sort({ riskScore: -1, createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('SocialMediaPost', socialMediaPostSchema);