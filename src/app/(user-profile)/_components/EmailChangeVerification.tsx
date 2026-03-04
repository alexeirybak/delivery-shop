import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface EmailChangeVerificationProps {
  username: string;
  currentEmail: string;
  newEmail: string;
  verificationUrl: string;
}

const EmailChangeVerification = (props: EmailChangeVerificationProps) => {
  const { username, currentEmail, newEmail, verificationUrl } = props;

  return (
    <Html lang="ru" dir="ltr">
      <Head />
      <Body style={{
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif',
        padding: '16px 8px',
        margin: 0
      }}>
        <Container style={{
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          padding: '24px',
          maxWidth: '580px',
          margin: '0 auto'
        }}>
          <Section>
            <Text style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 16px 0'
            }}>
              Подтверждение смены email
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#374151',
              margin: '0 0 16px 0',
              lineHeight: '1.25'
            }}>
              Здравствуйте, {username}! Мы получили запрос на изменение email
              адреса для вашего аккаунта.
            </Text>

            <Section style={{
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <Text style={{
                fontSize: '14px',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                <strong>Текущий email:</strong> {currentEmail}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#374151',
                margin: 0
              }}>
                <strong>Новый email:</strong> {newEmail}
              </Text>
            </Section>

            <Text style={{
              fontSize: '16px',
              color: '#374151',
              margin: '0 0 16px 0',
              lineHeight: '1.25'
            }}>
              Для подтверждения смены email нажмите на кнопку ниже:
            </Text>

            <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Button
                href={verificationUrl}
                style={{
                  backgroundColor: '#70c05b',
                  color: '#ffffff',
                  padding: '8px 24px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'medium',
                  textDecoration: 'none'
                }}
              >
                Подтвердить смену email
              </Button>
            </Section>

            <Text style={{
              fontSize: '14px',
              color: '#4b5563',
              margin: '0 0 16px 0',
              lineHeight: '1.25'
            }}>
              Если кнопка не работает, скопируйте и вставьте эту ссылку в
              адресную строку браузера:
              <br />
              <span style={{ wordBreak: 'break-all' }}>{verificationUrl}</span>
            </Text>

            <Text style={{
              fontSize: '14px',
              color: '#4b5563',
              margin: '0 0 24px 0',
              lineHeight: '1.25'
            }}>
              Ссылка для подтверждения будет активна в течение 24 часов. Если
              Вы не запрашивали изменение email, пожалуйста, проигнорируйте
              это письмо или свяжитесь со службой поддержки.
            </Text>

            <Hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

            <Text style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1'
            }}>
              С уважением,
              <br />
              Команда &quot;Северяночки&quot;
            </Text>
          </Section>

          <Section style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Text style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '0 0 0 0',
              textAlign: 'center',
              lineHeight: '1'
            }}>
              Северяночка
              <br />
              Россия, Архангельск, ул. Ленина, д.1
              <br />
              ИНН 0291234567890
            </Text>

            <Text style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '8px 0 0 0',
              textAlign: 'center',
              lineHeight: '1'
            }}>
              © {new Date().getFullYear()} Северяночка. Все права защищены.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailChangeVerification;