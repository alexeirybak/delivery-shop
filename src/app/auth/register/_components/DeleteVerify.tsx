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

interface DeleteVerifyProps {
  username: string;
  verifyUrl: string;
}

const DeleteVerify = (props: DeleteVerifyProps) => {
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
              Подтверждение удаления аккаунта
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Здравствуйте, {username}! Мы получили запрос на удаление Вашего
              аккаунта в &quot;NeuroDidactica&quot;.
            </Text>

            <Section
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#b91c1c",
                  margin: "0 0 8px 0",
                  fontWeight: "bold",
                }}
              >
                Внимание: это действие необратимо!
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#b91c1c",
                  margin: 0,
                }}
              >
                После удаления аккаунта все Ваши данные будут безвозвратно удалены:
                созданные учебные материалы, сгенерированный контент, шаблоны,
                история генерации, достижения, персональные настройки и доступ
                ко всем созданным курсам.
              </Text>
            </Section>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                margin: "0 0 16px 0",
                lineHeight: "1.25",
              }}
            >
              Если Вы действительно хотите удалить аккаунт и потерять весь
              созданный Вами контент, нажмите на кнопку ниже:
            </Text>

            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <Button
                href={verifyUrl}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "medium",
                  textDecoration: "none",
                }}
              >
                Подтвердить удаление аккаунта
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
              <span style={{ wordBreak: "break-all", color: "#2563eb" }}>
                {verifyUrl}
              </span>
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
              не запрашивали удаление аккаунта, пожалуйста, проигнорируйте это
              письмо или свяжитесь со службой поддержки для обеспечения
              безопасности Вашего аккаунта.
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
              NeuroDidactica — образовательная платформа для генерации контента
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

export default DeleteVerify;