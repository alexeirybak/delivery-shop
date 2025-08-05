import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import VerifyEmail from "@/components/verify-email";
import { phoneNumber } from "better-auth/plugins";
import bcrypt from "bcrypt";

const client = new MongoClient(process.env.DELIVERY_SHOP_DB_URL!);
const db = client.db("delivery-shop");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      phoneNumber: { type: "string", input: true, required: true },
      surname: { type: "string", input: true, required: true },
      password: { type: "string", input: true, required: true },
      birthdayDate: { type: "string", input: true, required: true },
      region: { type: "string", input: true, required: true },
      location: { type: "string", input: true, required: true },
      gender: { type: "string", input: true, required: true },
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
        getTempEmail: (phone) => `${phone}@delivery-shop.com`,
        getTempName: (phone) => `user_${phone}`,
      },

      callbackOnVerification: async ({ phoneNumber, user }, request) => {
        console.log("Телефон пользователя:", phoneNumber);
        console.log("Пользователь:", user);
        console.log("Запрос", request);
      },
      requireVerification: true,
      otpLength: 4,
      expiresIn: 300,
      allowedAttempts: 3,
    }),
  ],
});

auth.handler("POST", "/api/auth/set-password", async (request) => {
  const { userId, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

  return { success: true };
});
