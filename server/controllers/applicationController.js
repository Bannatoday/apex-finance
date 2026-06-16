const Application = require('../models/Application');
const { sendEmail, sendAdminNotification } = require('../emails/emailService');
const templates = require('../emails/templates');

// Submit new application (public)
exports.submitApplication = async (req, res) => {
  try {
    const { personalInfo, loanDetails, financialInfo } = req.body;

    // Parse JSON fields if sent as FormData strings
    const parsedPersonalInfo = typeof personalInfo === 'string' ? JSON.parse(personalInfo) : personalInfo;
    const parsedLoanDetails = typeof loanDetails === 'string' ? JSON.parse(loanDetails) : loanDetails;
    const parsedFinancialInfo = typeof financialInfo === 'string' ? JSON.parse(financialInfo) : financialInfo;

    // Build documents object from uploaded files
    const documents = {};
    if (req.files) {
      if (req.files.governmentIdFront) documents.governmentIdFront = req.files.governmentIdFront[0].filename;
      if (req.files.governmentIdBack) documents.governmentIdBack = req.files.governmentIdBack[0].filename;
      if (req.files.paystub) documents.paystub = req.files.paystub[0].filename;
      if (req.files.bankStatement) documents.bankStatement = req.files.bankStatement[0].filename;
    }

    const application = new Application({
      personalInfo: parsedPersonalInfo,
      loanDetails: parsedLoanDetails,
      financialInfo: parsedFinancialInfo,
      documents
    });

    await application.save();

    // Send confirmation email to applicant
    const emailData = templates.applicationReceived(application);
    const emailResult = await sendEmail({
      to: parsedPersonalInfo.email,
      ...emailData
    });

    // Log email in history
    application.emailHistory.push({
      type: 'application_received',
      sentAt: new Date(),
      status: emailResult.success ? 'sent' : 'failed'
    });

    // Send admin notification
    const adminEmailData = templates.adminNotification(application);
    await sendAdminNotification(adminEmailData);

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully!',
      applicationId: application.applicationId
    });
  } catch (error) {
    console.error('Submit application error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Failed to submit application. Please try again.' });
  }
};

// Track application (public — by email + applicationId)
exports.trackApplication = async (req, res) => {
  try {
    const { email, applicationId } = req.body;

    if (!email || !applicationId) {
      return res.status(400).json({ message: 'Email and Application ID are required.' });
    }

    const application = await Application.findOne({
      applicationId: applicationId.toUpperCase(),
      'personalInfo.email': email.toLowerCase()
    });

    if (!application) {
      return res.status(404).json({ message: 'No application found. Please check your email and application ID.' });
    }

    // Return safe public data (no admin notes, no SSN)
    res.json({
      applicationId: application.applicationId,
      status: application.status,
      loanDetails: application.loanDetails,
      personalInfo: {
        firstName: application.personalInfo.firstName,
        lastName: application.personalInfo.lastName,
        email: application.personalInfo.email
      },
      documents: {
        governmentIdFront: !!application.documents?.governmentIdFront,
        governmentIdBack: !!application.documents?.governmentIdBack,
        paystub: !!application.documents?.paystub,
        bankStatement: !!application.documents?.bankStatement
      },
      approvedDetails: application.status === 'approved' ? application.approvedDetails : null,
      statusHistory: application.statusHistory,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    });
  } catch (error) {
    console.error('Track application error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Upload documents to existing application (public — verified by email + applicationId)
exports.uploadDocuments = async (req, res) => {
  try {
    const { email, applicationId } = req.body;

    if (!email || !applicationId) {
      return res.status(400).json({ message: 'Email and Application ID are required.' });
    }

    const application = await Application.findOne({
      applicationId: applicationId.toUpperCase(),
      'personalInfo.email': email.toLowerCase()
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    // Update documents
    if (req.files.governmentIdFront) application.documents.governmentIdFront = req.files.governmentIdFront[0].filename;
    if (req.files.governmentIdBack) application.documents.governmentIdBack = req.files.governmentIdBack[0].filename;
    if (req.files.paystub) application.documents.paystub = req.files.paystub[0].filename;
    if (req.files.bankStatement) application.documents.bankStatement = req.files.bankStatement[0].filename;

    await application.save();

    res.json({
      message: 'Documents uploaded successfully!',
      documents: {
        governmentIdFront: !!application.documents?.governmentIdFront,
        governmentIdBack: !!application.documents?.governmentIdBack,
        paystub: !!application.documents?.paystub,
        bankStatement: !!application.documents?.bankStatement
      }
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all applications (admin)
exports.getApplications = async (req, res) => {
  try {
    const { status, loanType, search, startDate, endDate, minAmount, maxAmount, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (loanType) filter['loanDetails.type'] = loanType;
    if (search) {
      filter.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter['loanDetails.amount'] = {};
      if (minAmount) filter['loanDetails.amount'].$gte = Number(minAmount);
      if (maxAmount) filter['loanDetails.amount'].$lte = Number(maxAmount);
    }

    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-documents -adminNotes -emailHistory');

    res.json({
      applications,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single application (admin)
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update application status (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNotes, approvedDetails } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const oldStatus = application.status;
    application.status = status;

    if (adminNotes !== undefined) {
      application.adminNotes = adminNotes;
    }

    if (approvedDetails) {
      application.approvedDetails = approvedDetails;
    }

    // Add to status history
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.admin.name
    });

    // Send status email
    let emailData = null;
    let emailType = '';

    switch (status) {
      case 'under_review':
        emailData = templates.underReview(application);
        emailType = 'under_review';
        break;
      case 'approved':
        emailData = templates.approved(application);
        emailType = 'approved';
        break;
      case 'rejected':
        emailData = templates.rejected(application);
        emailType = 'rejected';
        break;
    }

    if (emailData && status !== oldStatus) {
      const emailResult = await sendEmail({
        to: application.personalInfo.email,
        ...emailData
      });

      application.emailHistory.push({
        type: emailType,
        sentAt: new Date(),
        status: emailResult.success ? 'sent' : 'failed'
      });
    }

    await application.save();

    res.json({ message: `Application status updated to ${status}.`, application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get dashboard stats (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const [total, pending, underReview, approved, rejected] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'under_review' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' })
    ]);

    // Total loan amount
    const totalAmountResult = await Application.aggregate([
      { $group: { _id: null, total: { $sum: '$loanDetails.amount' } } }
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    // Applications over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyApplications = await Application.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Applications by loan type
    const byLoanType = await Application.aggregate([
      { $group: { _id: '$loanDetails.type', count: { $sum: 1 } } }
    ]);

    // Applications by status
    const byStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent applications
    const recentApplications = await Application.find()
      .sort('-createdAt')
      .limit(10)
      .select('applicationId personalInfo.firstName personalInfo.lastName loanDetails.type loanDetails.amount status createdAt');

    res.json({
      stats: { total, pending, underReview, approved, rejected, totalAmount },
      charts: { dailyApplications, byLoanType, byStatus },
      recentApplications
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Export applications to CSV (admin)
exports.exportCSV = async (req, res) => {
  try {
    const applications = await Application.find().sort('-createdAt');

    const headers = 'Application ID,First Name,Last Name,Email,Phone,Loan Type,Amount,Purpose,Tenure,Employment,Monthly Income,Credit Score,Status,Created At\n';

    const rows = applications.map(app => {
      return [
        app.applicationId,
        app.personalInfo.firstName,
        app.personalInfo.lastName,
        app.personalInfo.email,
        app.personalInfo.phone,
        app.loanDetails.type,
        app.loanDetails.amount,
        app.loanDetails.purpose,
        app.loanDetails.tenure,
        app.financialInfo.employmentStatus,
        app.financialInfo.monthlyIncome,
        app.financialInfo.creditScore,
        app.status,
        new Date(app.createdAt).toLocaleDateString('en-US')
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=applications_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(headers + rows);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
