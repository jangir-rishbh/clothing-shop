import nodemailer from 'nodemailer';

// Check configuration on startup
console.log('Email Configuration Status:', {
  service: 'gmail',
  emailConfigured: !!process.env.NEXT_PUBLIC_GMAIL_EMAIL,
  authConfigured: !!process.env.GMAIL_APP_PASSWORD
});

interface SendEmailResponse {
  success: boolean;
  messageId: string;
  previewUrl?: string;
}

export const sendOtpEmail = async (to: string, otp: string): Promise<SendEmailResponse> => {
  if (!process.env.NEXT_PUBLIC_GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing email configuration:', {
      email: process.env.NEXT_PUBLIC_GMAIL_EMAIL ? 'Configured' : 'Missing',
      appPassword: process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Missing'
    });
    throw new Error('Email configuration is incomplete. Please check your environment variables.');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    await new Promise<void>((resolve, reject) => {
      transporter.verify((error) => {
        if (error) {
          console.error('SMTP Connection Error:', error);
          reject(error);
        } else {
          console.log('SMTP Server is ready to send messages');
          resolve();
        }
      });
    });

    const mailOptions = {
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'Your App'}" <${process.env.NEXT_PUBLIC_GMAIL_EMAIL}>`,
      to,
      subject: 'Your Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Use the following OTP to proceed:</p>
          <div style="background: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 2px;">
            ${otp}
          </div>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    const info = await new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent successfully:', info.messageId);
          resolve(info);
        }
      });
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl
    };
  } catch (error) {
    console.error('Error in sendOtpEmail:', error);
    throw new Error('Failed to send OTP email');
  }
};
