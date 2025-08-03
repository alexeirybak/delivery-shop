// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";
// import { Resend } from "resend";
// import VerifyEmail from "@/components/verify-email";
// import { phoneNumber } from "better-auth/plugins";

// const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
// const db = client.db("delivery-shop");
// const resend = new Resend(process.env.RESEND_API_KEY);

// export const auth = betterAuth({
//   database: mongodbAdapter(db),
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: true,
//   },
//   user: {
//     additionalFields: {
//       surname: { type: "string", input: true, required: true },
//       birthdayDate: { type: "string", input: true, required: true },
//       region: { type: "string", input: true, required: true },
//       location: { type: "string", input: true, required: true },
//       gender: { type: "string", input: true, required: true },
//       card: { type: "string", input: true, required: false },
//       hasCard: { type: "boolean", input: true, required: false },
//     },
//   },
//   emailVerification: {
//     sendOnSignUp: false,
//     autoSignInAfterVerification: false,
//     callbackURL: "/login",
//     sendVerificationEmail: async ({ user, url }) => {
//       await resend.emails.send({
//         from: "Северяночка <onboarding@resend.dev>",
//         to: user.email,
//         subject: "Подтвердите email",
//         react: VerifyEmail({ username: user.name, verifyUrl: url }),
//       });
//     },
//   },
//   plugins: [
//     phoneNumber({
//       sendOTP: async ({ phoneNumber, code }) => {
//         // В development просто логируем код
//         if (process.env.NODE_ENV !== "production") {
//           console.log(`[DEV] Код для ${phoneNumber}: ${code}`);
//           return;
//         }
//         // Реальная отправка SMS
//         const response = await fetch(`https://sms.ru/sms/send?api_id=...`);
//         if (!response.ok) throw new Error("Ошибка отправки SMS");
//       },
//       signUpOnVerification: {
//         getTempEmail: (phone) => `${phone}@delivery-shop.com`,
//         getTempName: (phone) => `user_${phone}`,
//       },
//       requireVerification: true,
//       otpLength: 4,
//       expiresIn: 300, // 5 минут
//     }),
//   ],
// });

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import VerifyEmail from "@/components/verify-email";
import { phoneNumber } from "better-auth/plugins";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      phoneNumber: { type: "string", input: true, required: false },
      surname: { type: "string", input: true, required: false },
      birthdayDate: { type: "string", input: true, required: false },
      region: { type: "string", input: true, required: false },
      location: { type: "string", input: true, required: false },
      gender: { type: "string", input: true, required: false },
      card: { type: "string", input: true, required: false },
      hasCard: { type: "boolean", input: true, required: false },
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: false,
    callbackURL: "/login",
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Северяночка <onboarding@resend.dev>",
        to: user.email,
        subject: "Подтвердите email",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
      console.log(`[DEBUG] Отправка OTP: ${code} для ${phoneNumber}`);
      // ...
    },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone}@yourdomain.com`,
        getTempName: (phone) => `user_${phone}`,
      },
      requireVerification: true,
      otpLength: 4,
      expiresIn: 300, // 5 минут
    }),
  ],
});
