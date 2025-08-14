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

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

const VerifyEmail = (props: VerifyEmailProps) => {
  const { username, verifyUrl } = props;
  return (
    <Html lang="ru" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-4 px-2">
          <Container className="bg-white rounded-md p-6 max-w-145 mx-auto">
            <Section>
              <Text className="text-xl font-bold text-gray-900 mb-4 mt-0">
                Подтвердите Ваш email
              </Text>

              <Text className="text-base text-gray-700 mb-4 mt-0 leading-5">
                Спасибо, {username}, за регистрацию! Чтобы завершить процесс и
                активировать Ваш аккаунт, пожалуйста, подтвердите Ваш email,
                нажав на кнопку ниже.
              </Text>

              <Section className="text-center mb-6">
                <Button
                  href={verifyUrl}
                  className="bg-[#70C05B] hover: text-white px-6 py-2 rounded text-base font-medium no-underline"
                >
                  Подтвердить Email
                </Button>
              </Section>

              <Text className="text-sm text-gray-600 mb-4 mt-0 leading-5">
                Если кнопка не работает, скопируйте и вставьте эту ссылку в
                адресную строку браузера:
                <br />
                <span className="break-all">{verifyUrl}</span>
              </Text>

              <Text className="text-sm text-gray-600 mb-6 mt-0 leading-5">
                Ссылка для подтверждения будет активна в течение 24 часов. Если
                Вы не регистрировали аккаунт, просто проигнорируйте это письмо.
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

export default VerifyEmail;
