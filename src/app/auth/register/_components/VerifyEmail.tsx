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

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

const VerifyEmail = (props: VerifyEmailProps) => {
  const { username, verifyUrl } = props;
  return (
    <Html lang="ru" dir="ltr">
      <Head />
      <Body
        style={{
          backgroundColor: "#f3f4f6",
          fontFamily: "Arial, sans-serif",
          padding: "16px 8px",
          margin: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "24px",
            maxWidth: "580px",
            margin: "0 auto",
          }}
        >
          <Section>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#111827",
                margin: "0 0 16px 0",
              }}
            >
              Подтвердите Ваш email
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Спасибо, {username}, за регистрацию! Чтобы завершить процесс и
              активировать Ваш аккаунт, пожалуйста, подтвердите Ваш email, нажав
              на кнопку ниже.
            </Text>

            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <Button
                href={verifyUrl}
                style={{
                  backgroundColor: "#70c05b",
                  color: "#ffffff",
                  padding: "8px 24px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "medium",
                  textDecoration: "none",
                }}
              >
                Подтвердить Email
              </Button>
            </Section>

            <Text
              style={{
                fontSize: "14px",
                color: "#4b5563",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Если кнопка не работает, скопируйте и вставьте эту ссылку в
              адресную строку браузера:
              <br />
              <span style={{ wordBreak: "break-all" }}>{verifyUrl}</span>
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#4b5563",
                margin: "0 0 24px 0",
                lineHeight: "1.25",
              }}
            >
              Ссылка для подтверждения будет активна в течение 24 часов. Если Вы
              не регистрировали аккаунт, просто проигнорируйте это письмо.
            </Text>

            <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

            <Text
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: 0,
                lineHeight: "1",
              }}
            >
              С уважением,
              <br />
              Команда &quot;NeuroDidactica&quot;
            </Text>
          </Section>

          <Section
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "0 0 0 0",
                textAlign: "center",
                lineHeight: "1",
              }}
            >
              NeuroDidactica
              <br />
              Россия, Северодвинск
            </Text>

            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "8px 0 0 0",
                textAlign: "center",
                lineHeight: "1",
              }}
            >
              © {new Date().getFullYear()} NeuroDidactica. Все права защищены.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;
