import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { getDb } from "./db";

export const auth = betterAuth({
  database: getDb(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      userType: {
        type: "string",
        required: false,
      },
      city: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
      },
      dateOfBirth: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [admin()],
});
