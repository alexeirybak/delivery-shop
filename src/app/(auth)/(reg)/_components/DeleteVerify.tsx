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

interface DeleteVerifyProps {
  username: string;
  verifyUrl: string;
}

const DeleteVerify = (props: DeleteVerifyProps) => {
  const { username, verifyUrl } = props;

  return (
    <Html lang="ru" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-4 px-2">
          <Container className="bg-white rounded-md p-6 max-w-145 mx-auto">
            <Section>
              <Text className="text-xl font-bold text-gray-900 mb-4 mt-0">
                Подтверждение удаления аккаунта
              </Text>

              <Text className="text-base text-gray-700 mb-4 mt-0 leading-5">
                Здравствуйте, {username}! Мы получили запрос на удаление Вашего
                аккаунта в &quot;Северяночке&quot;.
              </Text>

              <Section className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <Text className="text-sm text-red-700 mb-2 mt-0 font-semibold">
                  Внимание: это действие необратимо!
                </Text>
                <Text className="text-sm text-red-700 mb-0 mt-0">
                  После удаления аккаунта все Ваши данные, включая историю
                  заказов, бонусные баллы и персональные настройки, будут
                  безвозвратно удалены.
                </Text>
              </Section>

              <Text className="text-base text-gray-700 mb-4 mt-0 leading-5">
                Если Вы хотите продолжить удаление аккаунта, нажмите на кнопку
                ниже:
              </Text>

              <Section className="text-center mb-6">
                <Button
                  href={verifyUrl}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded text-base font-medium no-underline"
                >
                  Подтвердить удаление аккаунта
                </Button>
              </Section>

              <Text className="text-sm text-gray-600 mb-4 mt-0 leading-5">
                Если кнопка не работает, скопируйте и вставьте эту ссылку в
                адресную строку браузера:
                <br />
                <span className="break-all text-blue-600">{verifyUrl}</span>
              </Text>

              <Text className="text-sm text-gray-600 mb-6 mt-0 leading-5">
                Ссылка для подтверждения будет активна в течение 24 часов. Если
                Вы не запрашивали удаление аккаунта, пожалуйста, проигнорируйте
                это письмо или свяжитесь со службой поддержки для обеспечения
                безопасности Вашего аккаунта.
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

export default DeleteVerify;
