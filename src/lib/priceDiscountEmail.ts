import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import dotenv from "dotenv";
import path from "path";
import PriceAlertEmail from "@/app/(catalog)/catalog/[category]/(productPage)/[slug]/_components/PriceAlertEmail";
import { baseUrl } from "../../utils/baseUrl";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
});

interface SendPriceAlertEmailParams {
  to: string;
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  productId: string;
  unsubscribeToken: string;
}

export async function sendPriceAlertEmail({
  to,
  productTitle,
  oldPrice,
  newPrice,
  productId,
  unsubscribeToken,
}: SendPriceAlertEmailParams): Promise<boolean> {
  try {
    const encodedTitle = encodeURIComponent(productTitle);
    const productUrl = `${baseUrl}/catalog/product/${productId}?desc=${encodedTitle}`;
    const unsubscribeUrl = `${baseUrl}/api/price-alerts/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(to)}`;

    const html = await render(
      PriceAlertEmail({
        productTitle,
        oldPrice,
        newPrice,
        productUrl,
        unsubscribeUrl,
      })
    );

    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject: `Цена на "${productTitle}" снизилась!`,
      html,
    });

    return true;
  } catch (error) {
    console.error("Ошибка отправки письма:", error);
    return false;
  }
}