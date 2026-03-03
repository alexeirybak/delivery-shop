import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

// Создаем transporter для Smtp.bz
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.smtp.bz', // SMTP сервер Smtp.bz
  port: parseInt(process.env.SMTP_PORT || '2525'), // Обычно 2525, 587 или 465
  secure: process.env.SMTP_SECURE === 'true', // true для 465, false для других портов
  auth: {
    user: process.env.SMTP_USER, // ваш логин от Smtp.bz
    pass: process.env.SMTP_PASSWORD, // ваш пароль
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
    // Рендерим React компонент в HTML
    const html = await render(react);
    
    // Отправляем через Smtp.bz
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