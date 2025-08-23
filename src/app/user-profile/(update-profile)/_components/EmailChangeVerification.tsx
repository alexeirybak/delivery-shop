import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
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
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-4 px-2">
          <Container className="bg-white rounded-md p-6 max-w-145 mx-auto">
            <Section>
              <Text className="text-xl font-bold text-gray-900 mb-4 mt-0">
                Подтверждение смены email
              </Text>

              <Text className="text-base text-gray-700 mb-4 mt-0 leading-5">
                Здравствуйте, {username}! Мы получили запрос на изменение email
                адреса для вашего аккаунта.
              </Text>

              <Section className="bg-gray-50 rounded-md p-4 mb-6">
                <Text className="text-sm text-gray-700 mb-2 mt-0">
                  <strong>Текущий email:</strong> {currentEmail}
                </Text>
                <Text className="text-sm text-gray-700 mb-0 mt-0">
                  <strong>Новый email:</strong> {newEmail}
                </Text>
              </Section>

              <Text className="text-base text-gray-700 mb-4 mt-0 leading-5">
                Для подтверждения смены email нажмите на кнопку ниже:
              </Text>

              <Section className="text-center mb-6">
                <Button
                  href={verificationUrl}
                  className="bg-[#70C05B] hover: text-white px-6 py-2 rounded text-base font-medium no-underline"
                >
                  Подтвердить смену email
                </Button>
              </Section>

              <Text className="text-sm text-gray-600 mb-4 mt-0 leading-5">
                Если кнопка не работает, скопируйте и вставьте эту ссылку в
                адресную строку браузера:
                <br />
                <span className="break-all">{verificationUrl}</span>
              </Text>

              <Text className="text-sm text-gray-600 mb-6 mt-0 leading-5">
                Ссылка для подтверждения будет активна в течение 24 часов. Если
                Вы не запрашивали изменение email, пожалуйста, проигнорируйте
                это письмо или свяжитесь со службой поддержки.
              </Text>

              <Hr className="border-gray-200 my-4" />

              <Text className="text-xs text-gray-500 m-0 leading-4">
                С уважением,
                <br />
                Команда &quot;Северяночки&quot;
              </Text>
            </Section>

            <Section className="mt-6 pt-4 border-t border-gray-200">
              <Text className="text-xs text-gray-400 m-0 text-center leading-4">
                Северяночка
                <br />
                Россия, Архангельск, ул. Ленина, д.1
                <br />
                ИНН 0291234567890
              </Text>

              <Text className="text-xs text-gray-400 m-0 text-center mt-2 leading-4">
                © {new Date().getFullYear()} Северяночка. Все права защищены.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailChangeVerification;
