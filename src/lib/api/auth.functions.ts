import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  authenticateLogin,
  createPasswordResetToken,
  createSession,
  createVerificationToken,
  destroySession,
  getCustomerVerificationStatus,
  getSession,
  registerCustomer,
  resetPassword,
  verifyEmail,
  type AuthUser,
} from "../auth-store.server";
import { sendPasswordResetEmail, sendVerificationEmail } from "../email.server";

const LoginSchema = z.object({
  role: z.enum(["admin", "customer"]),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

const SessionSchema = z.object({
  token: z.string().trim().min(1),
});

const VerifyEmailSchema = z.object({
  token: z.string().trim().min(1),
});

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255),
});

const ResetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(8).max(128),
});

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    if (data.role === "customer") {
      const status = await getCustomerVerificationStatus(data.email);
      if (status && !status.emailVerified) {
        return { ok: false as const, reason: "unverified" as const };
      }
    }

    const user = await authenticateLogin(data.email, data.password, data.role);

    if (!user) {
      return { ok: false as const };
    }

    const token = await createSession(user.email, data.role);
    return { ok: true as const, token, user };
  });

export const registerCustomerUser = createServerFn({ method: "POST" })
  .inputValidator(RegisterSchema)
  .handler(async ({ data }) => {
    const created = await registerCustomer(data.name, data.email, data.password);

    if (!created) {
      return { ok: false as const };
    }

    if (created.verificationToken) {
      const emailResult = await sendVerificationEmail(
        created.user.email,
        created.verificationToken,
      );
      if (emailResult.sent === false) {
        console.warn(
          `Verification email was not sent. Dev link: ${created.user.email}?token=${created.verificationToken}`,
        );
      }
    }

    return { ok: true as const, verifyEmail: true, email: created.user.email };
  });

export const resendCustomerVerification = createServerFn({ method: "POST" })
  .inputValidator(ForgotPasswordSchema)
  .handler(async ({ data }) => {
    const status = await getCustomerVerificationStatus(data.email);
    if (!status || status.emailVerified) return { ok: false as const };

    const token = await createVerificationToken(data.email);
    if (!token) return { ok: false as const };

    const emailResult = await sendVerificationEmail(data.email, token);
    if (emailResult.sent === false) {
      console.warn(`Verification email was not sent. Dev link: ${data.email}?token=${token}`);
    }

    return { ok: true as const };
  });

export const verifyCustomerEmail = createServerFn({ method: "POST" })
  .inputValidator(VerifyEmailSchema)
  .handler(async ({ data }) => {
    const verified = await verifyEmail(data.token);
    return { ok: verified };
  });

export const sendPasswordResetLink = createServerFn({ method: "POST" })
  .inputValidator(ForgotPasswordSchema)
  .handler(async ({ data }) => {
    const token = await createPasswordResetToken(data.email);
    if (!token) return { ok: false as const };

    const emailResult = await sendPasswordResetEmail(data.email, token);
    if (emailResult.sent === false) {
      console.warn(`Password reset email was not sent. Dev link: /reset-password?token=${token}`);
    }

    return { ok: true as const };
  });

export const resetCustomerPassword = createServerFn({ method: "POST" })
  .inputValidator(ResetPasswordSchema)
  .handler(async ({ data }) => {
    const reset = await resetPassword(data.token, data.password);
    return { ok: reset };
  });

export const getCurrentAuthUser = createServerFn({ method: "POST" })
  .inputValidator(SessionSchema)
  .handler(async ({ data }) => {
    const session = await getSession(data.token);

    if (!session) {
      return { authed: false as const };
    }

    const user: AuthUser | { email: string; name: string; role: "admin" } = {
      email: session.email,
      name: session.role === "admin" ? "Admin" : "",
      role: session.role,
    };

    return { authed: true as const, user };
  });

export const logoutCurrentUser = createServerFn({ method: "POST" })
  .inputValidator(SessionSchema)
  .handler(async ({ data }) => {
    await destroySession(data.token);
    return { ok: true };
  });
