// lib/auth.ts
import PasswordResetEmail from "@/app/(auth)/(update-pass)/_components/PasswordResetEmail";
import VerifyEmail from "@/app/(auth)/(reg)/_components/VerifyEmail";
import EmailChangeVerification from "@/app/user-profile/(update-profile)/_components/EmailChangeVerification";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { CONFIG } from "../../config/config";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
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
    onPasswordReset: async ({ user }) => {
      console.log(`Пароль для пользователя ${user.email} был сброшен`);
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
  // ДОБАВЛЯЕМ ФУНКЦИОНАЛ СМЕНЫ EMAIL
  changeEmail: {
    enabled: true,
    sendChangeEmailVerification: async ({ user, newEmail, url }: { user: { email: string; name: string }; newEmail: string; url: string }) => {
      // Отправляем письмо подтверждения на текущий email
      await resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Подтверждение смены email в Северяночке",
        react: EmailChangeVerification({ 
          username: user.name, 
          currentEmail: user.email,
          newEmail,
          verificationUrl: url 
        }),
      });
    }
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}${CONFIG.TEMPORARY_EMAIL_DOMAIN}`;
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