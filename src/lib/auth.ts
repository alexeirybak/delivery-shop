import VerifyEmail from "@/app/(auth)/(reg)/_components/VerifyEmail";
import PasswordResetEmail from "@/app/(auth)/(update-pass)/_components/PasswordResetEmail";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { CONFIG } from "../../config/config";
import EmailChangeVerification from "@/app/(user-profile)/_components/EmailChangeVerification";
import DeleteVerify from "@/app/(auth)/(reg)/_components/DeleteVerify";
import { deleteUserAvatarFromGridFS } from "../../utils/deleteUserAvatar";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
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
        try {
          const cleanPhone = phoneNumber.replace(/\D/g, "");

          console.log(`[DEBUG] Отправка кода ${code} на номер ${cleanPhone}`);
          const url =
            `https://sms.ru/sms/send` +
            `?api_id=${process.env.SMS_API_ID}` +
            `&to=${cleanPhone}` +
            `&msg=Ваш код подтверждения от "Северяночки": ${code}` +
            `&json=1`;

          console.log(
            "[DEBUG] URL запроса:",
            url.replace(process.env.SMS_API_ID!, "***HIDDEN***"),
          );

          const response = await fetch(url);
          const result = await response.json();

          console.log(
            "[DEBUG] Полный ответ SMS.RU:",
            JSON.stringify(result, null, 2),
          );

          if (result.status !== "OK") {
            if (result.sms) {
              for (const phone in result.sms) {
                if (result.sms[phone].status !== "OK") {
                  throw new Error(
                    `Ошибка для номера ${phone}: ${result.sms[phone].status_text || "Неизвестная ошибка"}`,
                  );
                }
              }
            }
            throw new Error(result.status_text || "Ошибка отправки SMS");
          }

          console.log("[DEBUG] SMS успешно отправлена");
        } catch (error) {
          console.error("Ошибка отправки SMS:", error);
          throw error;
        }
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
    admin(),
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user,
        newEmail,
        url,
      }: {
        user: { email: string; name: string };
        newEmail: string;
        url: string;
      }) => {
        await resend.emails.send({
          from: "Северяночка <onboarding@resend.dev>",
          to: user.email,
          subject: "Подтверждение смены email в Северяночке",
          react: EmailChangeVerification({
            username: user.name,
            currentEmail: user.email,
            newEmail,
            verificationUrl: url,
          }),
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({
        user,
        url,
      }: {
        user: { email: string; name: string };
        url: string;
      }) => {
        await resend.emails.send({
          from: "Северяночка <onboarding@resend.dev>",
          to: user.email,
          subject: "Удаление аккаунта",
          react: DeleteVerify({ username: user.name, verifyUrl: url }),
        });
      },
      afterDelete: async (user) => {
        await deleteUserAvatarFromGridFS(user.id);
      },
    },
    additionalFields: {
      phoneNumber: { type: "string", input: true, required: true },
      surname: { type: "string", input: true, required: true },
      birthdayDate: { type: "date", input: true, required: true },
      region: { type: "string", input: true, required: true },
      location: { type: "string", input: true, required: true },
      gender: { type: "string", input: true, required: true },
      card: { type: "string", input: true, required: false },
      hasCard: { type: "boolean", input: true, required: false },
      role: {
        type: "string",
        input: false,
        required: false,
        default: "user",
      },
    },
  },
});

