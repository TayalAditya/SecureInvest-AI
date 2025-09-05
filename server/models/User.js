const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['INVESTOR', 'REGULATOR', 'ADMIN'],
    default: 'INVESTOR'
  },
  profile: {
    phone: String,
    dateOfBirth: Date,
    occupation: String,
    investmentExperience: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'BEGINNER'
    },
    riskTolerance: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    preferredLanguage: {
      type: String,
      default: 'en'
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    alertThreshold: {
      type: Number,
      min: 0,
      max: 100,
      default: 60
    },
    categories: [{
      type: String,
      enum: [
        'EQUITY',
        'MUTUAL_FUNDS',
        'BONDS',
        'COMMODITIES',
        'CRYPTO',
        'IPO',
        'DERIVATIVES'
      ]
    }]
  },
  verification: {
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    kycStatus: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    kycDocuments: [{
      type: String,
      documentType: String,
      uploadDate: Date,
      status: String
    }]
  },
  activity: {
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    },
    alertsReceived: {
      type: Number,
      default: 0
    },
    reportsSubmitted: {
      type: Number,
      default: 0
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'],
      default: 'FREE'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  settings: {
    theme: {
      type: String,
      enum: ['LIGHT', 'DARK'],
      default: 'LIGHT'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'verification.kycStatus': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.activity.lastLogin = new Date();
  this.activity.loginCount += 1;
  return this.save();
};

// Check if user can receive alerts
userSchema.methods.canReceiveAlerts = function() {
  return this.verification.isEmailVerified && this.subscription.isActive;
};

// Get user's alert threshold
userSchema.methods.getAlertThreshold = function() {
  return this.preferences.alertThreshold || 60;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for subscription status
userSchema.virtual('subscriptionStatus').get(function() {
  if (!this.subscription.isActive) return 'INACTIVE';
  if (this.subscription.endDate && this.subscription.endDate < new Date()) return 'EXPIRED';
  return 'ACTIVE';
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get user statistics
userSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        verifiedUsers: {
          $sum: { $cond: ['$verification.isEmailVerified', 1, 0] }
        },
        activeSubscriptions: {
          $sum: { $cond: ['$subscription.isActive', 1, 0] }
        },
        usersByRole: {
          $push: '$role'
        }
      }
    },
    {
      $project: {
        totalUsers: 1,
        verifiedUsers: 1,
        activeSubscriptions: 1,
        roleDistribution: {
          $reduce: {
            input: '$usersByRole',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: [
                    [{
                      k: '$$this',
                      v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] }
                    }]
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('User', userSchema);