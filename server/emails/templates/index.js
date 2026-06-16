const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #1B3A6B, #2a5298); padding: 30px; text-align: center; }
    .header h1 { color: #C9A84C; margin: 0; font-size: 24px; letter-spacing: 1px; }
    .header p { color: #ffffff; margin: 5px 0 0; font-size: 12px; opacity: 0.8; }
    .body { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .body h2 { color: #1B3A6B; margin-top: 0; }
    .info-box { background: #f8f9fa; border-left: 4px solid #C9A84C; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .info-box p { margin: 5px 0; font-size: 14px; }
    .info-box strong { color: #1B3A6B; }
    .btn { display: inline-block; background: linear-gradient(135deg, #1B3A6B, #2a5298); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .btn-success { background: linear-gradient(135deg, #2ECC71, #27ae60); }
    .footer { background: #1a1a2e; padding: 25px 30px; text-align: center; color: #999999; font-size: 12px; }
    .footer a { color: #C9A84C; text-decoration: none; }
    .divider { height: 1px; background: #e0e0e0; margin: 25px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>APEX FINANCE LLC</h1>
      <p>Your Trusted Loan Partner</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Apex Finance LLC</strong></p>
      <p>NMLS# 123456 | Not a lender. We connect borrowers with lenders.</p>
      <p>123 Financial District, Suite 500, New York, NY 10004</p>
      <div class="divider" style="background:#333; margin: 15px 0;"></div>
      <p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Website</a> |
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/privacy">Privacy Policy</a> |
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/terms">Terms & Conditions</a>
      </p>
      <p style="margin-top:10px;">© ${new Date().getFullYear()} Apex Finance LLC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Email 1: Application Received
const applicationReceived = (application) => {
  const { personalInfo, loanDetails, applicationId } = application;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  return {
    subject: 'We Received Your Loan Application — Apex Finance LLC',
    html: baseTemplate(`
      <h2>Thank You, ${personalInfo.firstName}!</h2>
      <p>We've successfully received your loan application. Our team will review your information and get back to you within <strong>24-48 business hours</strong>.</p>
      
      <div class="info-box">
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p><strong>Loan Type:</strong> ${loanDetails.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
        <p><strong>Loan Amount:</strong> $${Number(loanDetails.amount).toLocaleString()}</p>
        <p><strong>Submitted On:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Our team reviews your application</li>
        <li>We may contact you for additional documents</li>
        <li>You'll receive a decision via email within 24-48 hours</li>
      </ol>
      
      <p style="text-align:center;">
        <a href="${clientUrl}/contact" class="btn">Contact Us</a>
      </p>
      
      <div class="divider"></div>
      <p style="font-size:13px; color:#666;">If you did not submit this application, please contact us immediately at <a href="mailto:${process.env.ADMIN_EMAIL || 'admin@apexfinancellc.com'}">${process.env.ADMIN_EMAIL || 'admin@apexfinancellc.com'}</a>.</p>
    `)
  };
};

// Email 2: Under Review
const underReview = (application) => {
  const { personalInfo, applicationId } = application;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  return {
    subject: 'Your Application is Under Review — Apex Finance LLC',
    html: baseTemplate(`
      <h2>Hello, ${personalInfo.firstName}!</h2>
      <p>Great news! Your loan application <strong>${applicationId}</strong> is now being actively reviewed by our underwriting team.</p>
      
      <div class="info-box">
        <p><strong>Status:</strong> Under Review ⏳</p>
        <p><strong>Expected Decision:</strong> Within 24-48 business hours</p>
      </div>
      
      <p>During this process, we may reach out if we need any additional documentation. Please ensure:</p>
      <ul>
        <li>Your phone line is available for verification calls</li>
        <li>You can provide additional documents if requested</li>
        <li>Your email inbox is monitored for updates</li>
      </ul>
      
      <p style="text-align:center;">
        <a href="${clientUrl}/contact" class="btn">Contact Us</a>
      </p>
    `)
  };
};

// Email 3: Approved
const approved = (application) => {
  const { personalInfo, applicationId, approvedDetails, loanDetails } = application;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  const details = approvedDetails || {};
  
  return {
    subject: 'Congratulations! Your Loan is Approved — Apex Finance LLC',
    html: baseTemplate(`
      <h2>🎉 Congratulations, ${personalInfo.firstName}!</h2>
      <p>We're thrilled to inform you that your loan application <strong>${applicationId}</strong> has been <strong style="color:#2ECC71;">APPROVED</strong>!</p>
      
      <div class="info-box" style="border-left-color: #2ECC71;">
        <p><strong>Approved Amount:</strong> $${Number(details.approvedAmount || loanDetails.amount).toLocaleString()}</p>
        ${details.interestRate ? `<p><strong>Interest Rate:</strong> ${details.interestRate}% per annum</p>` : ''}
        ${details.tenure ? `<p><strong>Tenure:</strong> ${details.tenure} months</p>` : ''}
        ${details.monthlyEmi ? `<p><strong>Monthly EMI:</strong> $${Number(details.monthlyEmi).toLocaleString()}</p>` : ''}
      </div>
      
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Review your loan offer details carefully</li>
        <li>Our representative will contact you to discuss the terms</li>
        <li>Sign the loan agreement</li>
        <li>Funds will be disbursed to your account</li>
      </ol>
      
      <p style="text-align:center;">
        <a href="${clientUrl}/contact" class="btn btn-success">Get Started</a>
      </p>
      
      <div class="divider"></div>
      <p style="font-size:13px; color:#666;">If you have any questions about your approved loan, don't hesitate to reach out to our team.</p>
    `)
  };
};

// Email 4: Rejected
const rejected = (application) => {
  const { personalInfo, applicationId } = application;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  return {
    subject: 'Update on Your Loan Application — Apex Finance LLC',
    html: baseTemplate(`
      <h2>Hello, ${personalInfo.firstName}</h2>
      <p>Thank you for your interest in Apex Finance LLC. After careful review of your loan application <strong>${applicationId}</strong>, we regret to inform you that we are unable to approve your application at this time.</p>
      
      <div class="info-box" style="border-left-color: #e74c3c;">
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p><strong>Status:</strong> Not Approved</p>
      </div>
      
      <p>This decision was based on our current lending criteria and does not reflect on you personally. Here are some options you may consider:</p>
      <ul>
        <li><strong>Reapply after 90 days</strong> — Your financial situation may improve</li>
        <li><strong>Improve your credit score</strong> — Check out our blog for tips</li>
        <li><strong>Contact us</strong> — We can discuss alternative options</li>
      </ul>
      
      <p style="text-align:center;">
        <a href="${clientUrl}/contact" class="btn">Contact Us for Alternatives</a>
      </p>
      
      <div class="divider"></div>
      <p style="font-size:13px; color:#666;">We appreciate your trust in Apex Finance LLC and wish you the best in your financial journey.</p>
    `)
  };
};

// Email 5: Admin Notification
const adminNotification = (application) => {
  const { personalInfo, loanDetails, financialInfo, applicationId } = application;
  
  return {
    subject: `New Loan Application Received #${applicationId}`,
    html: baseTemplate(`
      <h2>📋 New Application Received</h2>
      <p>A new loan application has been submitted and requires review.</p>
      
      <div class="info-box">
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      
      <h3 style="color:#1B3A6B;">Applicant Details</h3>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${personalInfo.firstName} ${personalInfo.lastName}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${personalInfo.email}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${personalInfo.phone}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Location:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${personalInfo.city}, ${personalInfo.state} ${personalInfo.zip}</td></tr>
      </table>
      
      <h3 style="color:#1B3A6B; margin-top:25px;">Loan Details</h3>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Loan Type:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${loanDetails.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Amount:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">$${Number(loanDetails.amount).toLocaleString()}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Purpose:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${loanDetails.purpose}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Tenure:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${loanDetails.tenure} months</td></tr>
      </table>
      
      <h3 style="color:#1B3A6B; margin-top:25px;">Financial Info</h3>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Employment:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${financialInfo.employmentStatus}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Monthly Income:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">$${Number(financialInfo.monthlyIncome).toLocaleString()}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Credit Score:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${financialInfo.creditScore}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Existing Debt:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">$${Number(financialInfo.existingDebt || 0).toLocaleString()}/mo</td></tr>
      </table>
      
      <p style="text-align:center; margin-top:25px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/applications" class="btn">Review in Dashboard</a>
      </p>
    `)
  };
};

module.exports = {
  applicationReceived,
  underReview,
  approved,
  rejected,
  adminNotification
};
