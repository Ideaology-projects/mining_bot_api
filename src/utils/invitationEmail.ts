import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send an email with the given configuration.
 * @param {EmailOptions} options - Email configuration options
 * @returns {Promise<nodemailer.SentMessageInfo>} - Email sending result
 */
async function sendEmail({
  from = 'no_reply@rechargermonauto.com',
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<nodemailer.SentMessageInfo> {
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

const sendResetEmail = async (email: string, token: string) => {
  // const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset',
    html: `<p>Please copy the link and <a href="http://localhost:3000/api/v1/reset/reset-password?token=${token}">reset your password</a>. This link expires in 1 hour.</p>`,
  });
};

export { sendEmail, sendResetEmail };
