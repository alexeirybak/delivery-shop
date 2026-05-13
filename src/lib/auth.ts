import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerifyEmail from "@/app/auth/register/_components/VerifyEmail";
import PasswordResetEmail from "@/app/auth/_components/PasswordResetEmail";
import DeleteVerify from "@/app/auth/register/_components/DeleteVerify";
import { deleteUserAvatarFromGridFS } from "@/app/auth/utils/deleteUserAvatar";
import EmailChangeVerification from "@/app/(user-part)/user-profile/_components/EmailChangeVerification";
import ExistingUserSignUp from "@/app/auth/register/_components/ExistingUserSignUp";

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
  baseURL: process.env.BETTER_AUTH_URL,

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }: { user: { email: string; name: string } }) => {
      await smtpEmail.send({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: user.email,
        subject: "Попытка регистрации в ваш аккаунт",
        react: ExistingUserSignUp({
          username: user.name,
          email: user.email,
          loginUrl: `${process.env.BETTER_AUTH_URL}/auth/login`,
        }),
      });
    },
    resetPasswordTokenExpiresIn: 86400,

    sendResetPassword: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
      await smtpEmail.send({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: user.email,
        subject: "Сброс пароля для NeuroDidactica",
        react: PasswordResetEmail({ username: user.name, resetUrl: url }),
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
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

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
      accessType: "offline",
    },
    vk: {
      clientId: process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
    },
  },

  plugins: [admin()],

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
          subject: "Подтверждение смены email в NeuroDidactica",
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
      afterDelete: async (user: { id: string }) => {
        await deleteUserAvatarFromGridFS(user.id);
      },
    },
    additionalFields: {
      status: {
        type: "string",
        input: true,
        required: false,
      },
      country: {
        type: "string",
        input: true,
        required: false,
      },
      organization: {
        type: "string",
        input: true,
        required: false,
      },
      specialization: {
        type: "string",
        input: true,
        required: false,
      },
      interests: {
        type: "string",
        input: true,
        required: false,
      },
      termsAccepted: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      hasPassword: { type: "boolean", required: false, defaultValue: false },
      role: {
        type: "string",
        input: false,
        required: false,
        default: "user",
      },
    },
  },
});