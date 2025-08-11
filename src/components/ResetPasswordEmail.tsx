import React from 'react';

interface PasswordResetEmailProps {
  username: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ username, resetUrl }: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h2>Здравствуйте, {username}!</h2>
      <p>Мы получили запрос на сброс пароля для Вашей учетной записи в &quot;Северяночке&quot;.</p>
      <p>Чтобы установить новый пароль, нажмите на кнопку ниже:</p>
      <p>
        <a 
          href={resetUrl} 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#70c05b',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
          }}
        >
          Сбросить пароль
        </a>
      </p>
      <p>Если Вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
      <p>С уважением,<br />Команда &quot;Северяночки&quot;</p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Ссылка действительна в течение 1 часа. Если срок действия ссылки истек, 
        запросите сброс пароля снова.
      </p>
    </div>
  );
}