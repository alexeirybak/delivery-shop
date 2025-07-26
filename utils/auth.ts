// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";
// import { nextCookies } from "better-auth/next-js";
// import { Resend } from "resend";
// import { phoneNumber } from "better-auth/plugins";

// export const resend = new Resend(process.env.RESEND_API_KEY);

// const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
// const db = client.db("delivery-shop");

// export const auth = betterAuth({
//   database: mongodbAdapter(db),
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     updateAge: 60 * 60 * 24 * 7,
//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60,
//     },
//   },
//   emailVerification: {
//     sendOnSignUp: true,
//     autoSignInAfterVerification: false,
//     callbackURL: "/login",
//     sendVerificationEmail: async ({ user, url }) => {
//       await resend.emails.send({
//         from: "Северяночка <onboarding@resend.dev>",
//         to: user.email,
//         subject: "Подтвердите свой email-адрес",
//         text: `Перейдите по ссылке для подтверждения: ${url}`,
//       });
//     },
//   },
//   // plugins: [
//   //   nextCookies(),
//   //   phoneNumber({
//   //     sendOTP: async ({ phoneNumber, code }) => {
//   //       const response = await fetch(
//   //         `https://sms.ru/sms/send?api_id=627B84ED-6DC9-12B4-0FB7-891CC33D62F4&to=${phoneNumber}&msg=Ваш код подтверждения: ${code}`
//   //       );
//   //       const data = await response.json();
//   //       if (data.status !== "OK") {
//   //         throw new Error("Не удалось отправить SMS");
//   //       }
//   //     },
//   //     signUpOnVerification: {
//   //       getTempEmail: (phone) => `${phone}@temp-email.com`,
//   //     },
//   //     requireVerification: true // Обязательное подтверждение телефона
//   //   })
//   // ],
//   plugins: [
//     phoneNumber({
//       sendOTP: ({ user.phone, code }, request) => {
//         // Implement sending OTP code via SMS
//       },
//     }),
//   ],
// });
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, 
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
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
        html: `Подтвердите регистрацию: <a href="${url}">${url}</a>`,
      });
    },
  },
  plugins: [
    nextCookies(),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        try {
          const cleanPhone = phoneNumber.replace(/\D/g, '');
          const response = await fetch(
            `https://sms.ru/sms/send?api_id=627B84ED-6DC9-12B4-0FB7-891CC33D62F4&to=${cleanPhone}&msg=Ваш код подтверждения: ${code}&json=1`
          );
          const result = await response.json();
          
          if (result.status !== "OK") {
            throw new Error(result.status_text || "Ошибка отправки SMS");
          }
        } catch (error) {
          console.error("SMS sending error:", error);
          throw error;
        }
      },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone.replace(/\D/g, '')}@temp.severyanochka.ru`
      },
      otpLength: 4,
      expiresIn: 300,
      requireVerification: true
    })
  ]
});