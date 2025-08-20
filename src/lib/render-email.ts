import { renderToString } from 'react-dom/server';
import VerifyEmail from '@/app/(auth)/(reg)/_components/VerifyEmail';
import { createElement } from 'react';

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

export async function renderVerifyEmail(props: VerifyEmailProps): Promise<string> {
  // Рендерим React компонент в HTML строку
  const html = renderToString(createElement(VerifyEmail, props));
  return html;
}