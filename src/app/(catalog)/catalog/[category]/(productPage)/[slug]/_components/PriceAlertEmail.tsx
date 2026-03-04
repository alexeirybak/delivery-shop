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
      <Head />
      <Body style={{
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
        padding: '32px 16px',
        margin: 0
      }}>
        <Container style={{
          backgroundColor: '#ffffff',
          maxWidth: '600px',
          margin: '0 auto',
          padding: 0
        }}>
          <Section style={{
            backgroundColor: '#ff6633',
            padding: '24px 32px',
            textAlign: 'center'
          }}>
            <Text style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}>
              🎉 Ура! Цена снизилась
            </Text>
            <Text style={{
              margin: 0,
              fontSize: '16px',
              color: '#ffffff'
            }}>
              Товар, на который Вы подписаны, стал дешевле!
            </Text>
          </Section>

          <Section style={{
            padding: '32px 32px'
          }}>
            <Section style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px',
              backgroundColor: '#fafafa'
            }}>
              <Text style={{
                marginBottom: '24px',
                fontSize: '20px',
                fontWeight: '600',
                textAlign: 'center',
                color: '#1a1a1a'
              }}>
                {productTitle}
              </Text>

              <Section>
                <Row style={{ marginBottom: '12px' }}>
                  <Column style={{ width: '50%' }}>
                    <Text style={{
                      margin: 0,
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}>
                      Старая цена:
                    </Text>
                  </Column>
                  <Column style={{ width: '50%', textAlign: 'right' }}>
                    <Text style={{
                      margin: 0,
                      fontSize: '16px',
                      textDecoration: 'line-through',
                      color: '#1a1a1a'
                    }}>
                      {oldPrice.toLocaleString("ru-RU")} ₽
                    </Text>
                  </Column>
                </Row>

                <Row style={{ marginBottom: '12px' }}>
                  <Column style={{ width: '50%' }}>
                    <Text style={{
                      margin: 0,
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}>
                      Новая цена:
                    </Text>
                  </Column>
                  <Column style={{ width: '50%', textAlign: 'right' }}>
                    <Text style={{
                      color: '#ff6633',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      {newPrice.toLocaleString("ru-RU")} ₽
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={{ width: '50%' }}>
                    <Text style={{
                      margin: 0,
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}>
                      Ваша экономия:
                    </Text>
                  </Column>
                  <Column style={{ width: '50%', textAlign: 'right' }}>
                    <Text style={{
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ff6633'
                    }}>
                      {savings.toLocaleString("ru-RU")} ₽
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
            
            <Text style={{
              marginBottom: '24px',
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#1a1a1a'
            }}>
              Не упустите возможность купить товар по выгодной цене!
            </Text>

            <Section style={{
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              <Button
                href={productUrl}
                style={{
                  backgroundColor: '#ff6633',
                  color: '#ffffff',
                  padding: '16px 48px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Перейти к товару
              </Button>
            </Section>

            <Hr style={{ borderColor: '#e0e0e0', margin: '32px 0' }} />

            <Section style={{ textAlign: 'center' }}>
              <Text style={{
                color: '#666666',
                fontSize: '14px',
                marginBottom: '16px',
                lineHeight: '20px'
              }}>
                Это письмо отправлено автоматически, потому что Вы подписались
                <br />
                на уведомления о снижении цены для этого товара.
              </Text>

              <Text style={{
                color: '#666666',
                fontSize: '14px',
                marginBottom: '24px'
              }}>
                <a href={unsubscribeUrl} style={{ color: '#ff6633', textDecoration: 'underline' }}>
                  Отписаться от уведомлений
                </a>
              </Text>

              <Text style={{
                color: '#666666',
                fontSize: '14px',
                margin: 0,
                lineHeight: '16px'
              }}>
                С уважением,
                <br />
                Команда &quot;Северяночки&quot;
              </Text>
            </Section>
          </Section>

          <Section style={{
            backgroundColor: '#f8f8f8',
            padding: '24px 32px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <Text style={{
              color: '#999999',
              fontSize: '12px',
              textAlign: 'center',
              lineHeight: '16px',
              marginBottom: '8px'
            }}>
              Северяночка
              <br />
              Россия, Архангельск, ул. Ленина, д.1
              <br />
              ИНН 0291234567890
            </Text>
            <Text style={{
              color: '#999999',
              fontSize: '12px',
              textAlign: 'center',
              lineHeight: '16px',
              margin: 0
            }}>
              © {new Date().getFullYear()} Северяночка. Все права защищены.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PriceAlertEmail;