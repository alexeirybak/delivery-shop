import React from "react";
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
  Row,
  Column,
} from "@react-email/components";

interface PriceAlertEmailProps {
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  productUrl: string;
  unsubscribeUrl: string;
}

const PriceAlertEmail = (props: PriceAlertEmailProps) => {
  const { productTitle, oldPrice, newPrice, productUrl, unsubscribeUrl } =
    props;
  const savings = oldPrice - newPrice;

  return (
    <Html lang="ru" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-[#f5f5f5] font-sans py-8 px-4">
          <Container className="bg-white rounded-none p-0 max-w-[600px] mx-auto">
            <Section className="bg-[#ff6633] py-6 px-8 text-center">
              <Text className="text-2xl font-bold text-white mb-2 mt-0">
                🎉 Ура! Цена снизилась
              </Text>
              <Text className="text-white text-base mb-0 mt-0">
                Товар, на который Вы подписаны, стал дешевле!
              </Text>
            </Section>

            <Section className="px-8 py-8">
              <Section className="border border-[#e0e0e0] rounded-lg p-6 mb-8 bg-[#fafafa]">
                <Text className="text-xl font-semibold text-main-text mb-6 text-center">
                  {productTitle}
                </Text>

                <Section className="space-y-3">
                  <Row>
                    <Column className="w-1/2">
                      <Text className="text-main-text text-base mb-0">
                        Старая цена:
                      </Text>
                    </Column>
                    <Column className="w-1/2 text-right">
                      <Text className="text-main-text text-base line-through mb-0">
                        {oldPrice.toLocaleString("ru-RU")} ₽
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column className="w-1/2">
                      <Text className="text-main-text text-base mb-0">
                        Новая цена:
                      </Text>
                    </Column>
                    <Column className="w-1/2 text-right">
                      <Text className="text-[#ff6633] text-xl font-bold mb-0">
                        {newPrice.toLocaleString("ru-RU")} ₽
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column className="w-1/2">
                      <Text className="text-main-text text-base mb-0">
                        Ваша экономия:
                      </Text>
                    </Column>
                    <Column className="w-1/2 text-right">
                      <Text className="text-primary text-lg font-bold mb-0">
                        {savings.toLocaleString("ru-RU")} ₽
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
              <Text className="text-main-text text-base mb-6 text-center leading-6">
                Не упустите возможность купить товар по выгодной цене!
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={productUrl}
                  className="bg-[#ff6633] text-white px-12 py-4 rounded text-base font-semibold no-underline"
                >
                  Перейти к товару
                </Button>
              </Section>

              <Hr className="border-[#e0e0e0] my-8" />

              <Section className="text-center">
                <Text className="text-[#666666] text-sm mb-4 leading-5">
                  Это письмо отправлено автоматически, потому что Вы подписались
                  <br />
                  на уведомления о снижении цены для этого товара.
                </Text>

                <Text className="text-[#666666] text-sm mb-6">
                  <a href={unsubscribeUrl} className="text-[#ff6633] underline">
                    Отписаться от уведомлений
                  </a>
                </Text>

                <Text className="text-[#666666] text-sm mb-0 leading-4">
                  С уважением,
                  <br />
                  Команда &quot;Северяночки&quot;
                </Text>
              </Section>
            </Section>

            <Section className="bg-[#f8f8f8] py-6 px-8 border-t border-[#e0e0e0]">
              <Text className="text-[#999999] text-xs text-center leading-4 mb-2">
                Северяночка
                <br />
                Россия, Архангельск, ул. Ленина, д.1
                <br />
                ИНН 0291234567890
              </Text>
              <Text className="text-[#999999] text-xs text-center leading-4 mt-0">
                © {new Date().getFullYear()} Северяночка. Все права защищены.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PriceAlertEmail;
