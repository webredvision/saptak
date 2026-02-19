import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "./models/UserModel";
import { ConnectDB } from "./db/ConnectDB";
import { getSiteData, sendOtpEmail } from "./functions";

function generateDeviceId(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = Date.now().toString(36); // base36 encoding of time
  let randomStr = "";

  for (let i = 0; i < length; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${timestamp}-${randomStr}`;
}

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
        otp: {},
      },
      async authorize(credentials) {
        await ConnectDB();
        const sitedata = await getSiteData();
        const { username, password, otp } = credentials;
        console.log(username, password, otp, "dmjswoid");
        if (!otp) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

          if (!passwordRegex.test(password)) {
            throw new Error(
              "Password must be at least 12 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
            );
          }
        }

        const user = await UserModel.findOne({
          $or: [{ username }, { email: username }],
        });

        if (!user) throw new Error("Invalid credentials");

        // Account block check
        if (user.blockUntil && user.blockUntil > new Date())
          throw new Error("Account temporarily blocked");

        // Password validation
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
          user.failedLoginAttempts += 1;
          if (user.failedLoginAttempts >= 5) {
            user.blockUntil = new Date(Date.now() + 15 * 60 * 1000);
            user.failedLoginAttempts = 0;
          }
          await user.save();
          throw new Error("Invalid credentials");
        }
        user.failedLoginAttempts = 0;

        // 🔹 ADMIN OTP FLOW
        if (user.role === "ADMIN") {
          // STEP 1: OTP not provided   send OTP only if none is valid
          if (!otp) {
            const otpStillValid =
              user.otpHash && user.otpExpiry && user.otpExpiry > new Date();

            if (!otpStillValid) {
              const newOtp = Math.floor(
                100000 + Math.random() * 900000,
              ).toString();
              user.otpHash = await bcrypt.hash(newOtp, 10);
              user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
              user.failedOtpAttempts = 0;
              await user.save();

              await sendOtpEmail({ otp: newOtp, user, sitedata });
            }

            // Stop login here until user enters OTP
            throw new Error("OTP_REQUIRED");
          }

          // STEP 2: OTP provided   validate
          if (!user.otpHash || !user.otpExpiry || user.otpExpiry < new Date()) {
            throw new Error("OTP expired");
          }

          const validOtp = await bcrypt.compare(otp, user.otpHash);
          if (!validOtp) {
            user.failedOtpAttempts += 1;
            if (user.failedOtpAttempts >= 3) {
              user.blockUntil = new Date(Date.now() + 15 * 60 * 1000);
              user.failedOtpAttempts = 0;
              user.otpHash = null;
              user.otpExpiry = null;
            }
            await user.save();
            throw new Error("Invalid OTP");
          }

          // STEP 3: OTP valid   clear OTP fields
          user.failedOtpAttempts = 0;
          user.otpHash = null;
          user.otpExpiry = null;
        }
        const deviceId = generateDeviceId();
        const tokenVersion = 1; // initial tokenVersion for this device
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

        // Add this session to the user's sessions map
        user.sessionsversion.set(deviceId, {
          version: tokenVersion,
          createdAt: new Date(),
          expiresAt: expiresAt,
        });
        await user.save();
        // 🔹 GENERATE CUSTOM JWT

        return {
          id: user._id.toString(),
          role: user.role,
          deviceId,
          tokenVersion,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.deviceId = user.deviceId;
        token.tokenVersion = user.tokenVersion;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.deviceId = token.deviceId;
      session.user.tokenVersion = token.tokenVersion;
      return session;
    },
  },

  pages: { signIn: "/signin", error: "/signin?error=true" },

  jwt: { secret: process.env.NEXTAUTH_SECRET },
};
