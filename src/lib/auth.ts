import VerifyEmail from "@/app/(auth)/(reg)/_components/VerifyEmail";
import PasswordResetEmail from "@/app/(auth)/(update-pass)/_components/PasswordResetEmail";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, phoneNumber } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { CONFIG } from "../../config/config";
import EmailChangeVerification from "@/app/(user-profile)/_components/EmailChangeVerification";
import DeleteVerify from "@/app/(auth)/(reg)/_components/DeleteVerify";
import { deleteUserAvatarFromGridFS } from "../../utils/deleteUserAvatar";

const client = new MongoClient(process.env.DB_CONNECTION_STRING!);
const db = client.db(process.env.DBNAME);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
});

interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  react: React.ReactElement;
}

const smtpEmail = {
  send: async ({ from, to, subject, react }: SendEmailParams) => {
    const html = await render(react);
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  },
};

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
           await smtpEmail.send({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: user.email,
        subject: "Сброс пароля для Северяночки",
        react: PasswordResetEmail({ username: user.name, resetUrl: url }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
            await smtpEmail.send({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
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

          const url =
            `https://sms.ru/sms/send` +
            `?api_id=${process.env.SMS_API_ID}` +
            `&to=${cleanPhone}` +
            `&msg=Ваш код подтверждения от "Северяночки": ${code}` +
            `&json=1`;

          const response = await fetch(url);
          const result = await response.json();

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
              await smtpEmail.send({
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
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
               await smtpEmail.send({
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
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