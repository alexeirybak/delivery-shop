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

interface ExistingUserSignUpProps {
  username: string;
  email: string;
  loginUrl: string;
}

const ExistingUserSignUp = (props: ExistingUserSignUpProps) => {
  const { username, email, loginUrl } = props;
  const currentYear = new Date().getFullYear();

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
              ⚠️ Попытка регистрации в аккаунт
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Здравствуйте, {username}!
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Кто-то попытался зарегистрироваться на платформе NeuroDidactica,
              используя Ваш email: <strong>{email}</strong>.
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Если это были Вы, просто войдите в свой аккаунт, используя кнопку
              ниже. Вам не нужно регистрироваться повторно.
            </Text>

            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <Button
                href={loginUrl}
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
                Войти в аккаунт
              </Button>
            </Section>

            <Text
              style={{
                fontSize: "14px",
                color: "#4b5563",
                margin: "0 0 24px 0",
                lineHeight: "1.25",
              }}
            >
              Если Вы не пытались войти в аккаунт, просто проигнорируйте это
              письмо. Ваш аккаунт в безопасности.
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
              © {currentYear} NeuroDidactica. Все права защищены.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ExistingUserSignUp;