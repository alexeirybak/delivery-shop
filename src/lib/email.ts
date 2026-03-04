import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'connect.smtp.bz', 
  port: parseInt(process.env.SMTP_PORT || '2525'), 
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailProps {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}

export async function sendEmail({ to, subject, react, from }: SendEmailProps) {
  try {
    const html = await render(react, {
      pretty: true,
      plainText: false,
    });
    
    const info = await transporter.sendMail({
      from: from || `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}