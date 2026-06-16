const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback: log emails to console in development
  console.log('⚠️  SendGrid not configured. Emails will be logged to console.');
  return null;
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!transporter) {
      console.log('📧 Email (dev mode):');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body: [HTML email - ${html.length} chars]`);
      return { success: true, dev: true };
    }

    const info = await transporter.sendMail({
      from: `"Apex Finance LLC" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

const sendAdminNotification = async ({ subject, html }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    html
  });
};

module.exports = { sendEmail, sendAdminNotification };
