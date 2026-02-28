import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";
import PriceAlertEmail from "@/app/(catalog)/catalog/[category]/(productPage)/[slug]/_components/PriceAlertEmail";
import { baseUrl } from "../../utils/baseUrl";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function sendPriceAlertEmail({
  to,
  productTitle,
  oldPrice,
  newPrice,
  productId,
  unsubscribeToken,
}: {
  to: string;
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  productId: string;
  unsubscribeToken: string;
}) {
  try {
    const encodedTitle = encodeURIComponent(productTitle);
    const productUrl = `${baseUrl}/catalog/product/${productId}?desc=${encodedTitle}`;
    const unsubscribeUrl = `${baseUrl}/api/price-alerts/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(to)}`;

    const { error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject: `Цена на "${productTitle}" снизилась!`,
      react: PriceAlertEmail({
        productTitle,
        oldPrice,
        newPrice,
        productUrl,
        unsubscribeUrl,
      }),
    });

    if (error) {
      console.error("Ошибка отправки письма:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Ошибка отправки письма:", error);
    return false;
  }
}
