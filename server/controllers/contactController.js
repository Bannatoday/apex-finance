const { sendEmail, sendAdminNotification } = require('../emails/emailService');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // Send notification to admin
    const adminHtml = `
      <h2>📬 New Contact Form Submission</h2>
      <div style="background:#f8f9fa; padding:20px; border-radius:8px; margin:15px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
      </div>
      <h3>Message:</h3>
      <p style="background:#f8f9fa; padding:20px; border-radius:8px;">${message}</p>
    `;

    await sendAdminNotification({
      subject: `New Contact Form: ${subject || 'General Inquiry'} — from ${name}`,
      html: adminHtml
    });

    // Send auto-reply to user
    const userHtml = `
      <h2>Thank You, ${name}!</h2>
      <p>We've received your message and will get back to you within <strong>1 business day</strong>.</p>
      <div style="background:#f8f9fa; border-left:4px solid #C9A84C; padding:15px 20px; margin:20px 0; border-radius:0 8px 8px 0;">
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
      </div>
      <p>In the meantime, feel free to explore our <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/faq" style="color:#1B3A6B;">FAQ page</a> for quick answers.</p>
      <p>Best regards,<br><strong>Apex Finance LLC Team</strong></p>
    `;

    await sendEmail({
      to: email,
      subject: 'Thank You for Contacting Apex Finance LLC',
      html: userHtml
    });

    res.json({ message: 'Your message has been sent successfully! We\'ll get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
};
