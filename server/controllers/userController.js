const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Application = require('../models/Application');

// Register user (after application submission)
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      password
    });

    await user.save();

    // Link any existing applications with this email to the user
    await Application.updateMany(
      { 'personalInfo.email': email.toLowerCase(), userId: { $exists: false } },
      { $set: { userId: user._id } }
    );

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User register error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      $or: [
        { userId: req.user._id },
        { 'personalInfo.email': req.user.email }
      ]
    }).sort('-createdAt');

    // Return safe data
    const safeApps = applications.map(app => ({
      _id: app._id,
      applicationId: app.applicationId,
      status: app.status,
      loanDetails: app.loanDetails,
      documents: {
        governmentIdFront: !!app.documents?.governmentIdFront,
        governmentIdBack: !!app.documents?.governmentIdBack,
        paystub: !!app.documents?.paystub,
        bankStatement: !!app.documents?.bankStatement
      },
      approvedDetails: app.status === 'approved' ? app.approvedDetails : null,
      statusHistory: app.statusHistory,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.json({ applications: safeApps });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Upload documents to user's application
exports.uploadDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      $or: [
        { userId: req.user._id },
        { 'personalInfo.email': req.user.email }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

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
