import VerifyEmail from "@/app/(auth)/(reg)/_components/VerifyEmail";
import PasswordResetEmail from "@/app/(auth)/(update-pass)/_components/PasswordResetEmail";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js"; // Импортируем nextCookies плагин
import { MongoClient } from "mongodb";
import { Resend } from "resend";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 дней в секундах (30 * 24 часа * 60 минут * 60 секунд)
    updateAge: 24 * 60 * 60, // Обновлять сессию каждые 24 часа
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 86400,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Сброс пароля для Северяночки",
        react: PasswordResetEmail({ username: user.name, resetUrl: url }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Подтвердите email",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
    expiresIn: 86400,
    autoSignInAfterVerification: false,
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@delivery-shop.ru`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
      allowedAttempts: 3,
      otpLength: 4,
      expiresIn: 300,
      requireVerification: true,
    }),
    nextCookies() // ДОБАВЛЯЕМ nextCookies плагин ПОСЛЕДНИМ в массиве
  ],
  user: {
    additionalFields: {
      phoneNumber: { type: "string", input: true, required: true },
      surname: { type: "string", input: true, required: true },
      birthdayDate: { type: "date", input: true, required: true },
      region: { type: "string", input: true, required: true },
      location: { type: "string", input: true, required: true },
      gender: { type: "string", input: true, required: true },
      card: { type: "string", input: true, required: false },
      hasCard: { type: "boolean", input: true, required: false },
    },
  },
});