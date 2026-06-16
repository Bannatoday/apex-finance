const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    ssnLast4: { type: String, required: true, minlength: 4, maxlength: 4 },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true }
  },
  loanDetails: {
    type: { 
      type: String, 
      required: true,
      enum: ['personal', 'business', 'mortgage', 'auto', 'student', 'debt-consolidation']
    },
    amount: { type: Number, required: true, min: 1000, max: 500000 },
    purpose: { type: String, required: true, trim: true },
    tenure: { type: Number, required: true, min: 6, max: 360 }
  },
  financialInfo: {
    employmentStatus: { 
      type: String, 
      required: true,
      enum: ['employed', 'self-employed', 'unemployed', 'retired', 'student']
    },
    employerName: { type: String, trim: true },
    monthlyIncome: { type: Number, required: true, min: 0 },
    creditScore: { 
      type: String, 
      required: true,
      enum: ['excellent-750+', 'good-700-749', 'fair-650-699', 'poor-below-650', 'no-credit']
    },
    existingDebt: { type: Number, default: 0, min: 0 }
  },
  documents: {
    governmentIdFront: { type: String },
    governmentIdBack: { type: String },
    paystub: { type: String },
    bankStatement: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  approvedDetails: {
    approvedAmount: { type: Number },
    interestRate: { type: Number },
    tenure: { type: Number },
    monthlyEmi: { type: Number }
  },
  emailHistory: [{
    type: { type: String },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
  }],
  statusHistory: [{
    status: { type: String },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String }
  }]
}, {
  timestamps: true
});

// Auto-generate application ID before saving
applicationSchema.pre('validate', async function(next) {
  if (this.isNew && !this.applicationId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Application').countDocuments();
    const paddedCount = String(count + 1).padStart(4, '0');
    this.applicationId = `APF-${year}-${paddedCount}`;
  }
  next();
});

// Add initial status to history
applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: 'pending',
      changedAt: new Date(),
      changedBy: 'system'
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
