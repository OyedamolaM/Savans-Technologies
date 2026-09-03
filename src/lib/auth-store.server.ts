import crypto from "node:crypto";

import { getServerConfig } from "./config.server";
import { getSupabaseServerClient } from "./supabase.server";

export type AuthUser = {
  email: string;
  name: string;
  role: "customer";
  emailVerified: boolean;
  createdAt: string;
};

type CustomerRow = {
  email: string;
  name: string;
  password_hash: string;
  salt: string;
  email_verified: boolean;
  created_at: string;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires_at: string | null;
};

type SessionRow = {
  token: string;
  email: string;
  role: "admin" | "customer";
  expires_at: string;
};

export async function registerCustomer(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const salt = crypto.randomBytes(16).toString("hex");
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const { data, error } = await getSupabaseServerClient()
    .from("customer_users")
    .insert({
      email: normalizedEmail,
      name,
      password_hash: hashPassword(password, salt),
      salt,
      verification_token: verificationToken,
    })
    .select()
    .single<CustomerRow>();
  if (error) {
    if (error.code === "23505") return null;
    throw new Error(`Could not create customer account: ${error.message}`);
  }
  return { user: toPublicUser(data), verificationToken };
}

export async function authenticateLogin(
  email: string,
  password: string,
  role: "admin" | "customer",
) {
  const normalizedEmail = email.toLowerCase();
  const config = getServerConfig();
  if (role === "admin") {
    const adminEmail = config.adminEmail.toLowerCase();
    if (
      !config.adminPassword ||
      normalizedEmail !== adminEmail ||
      !safeEqual(password, config.adminPassword)
    )
      return null;
    return { email: adminEmail, name: "Admin", role: "admin" as const };
  }

  const { data, error } = await getSupabaseServerClient()
    .from("customer_users")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle<CustomerRow>();
  if (error) throw new Error(`Could not read customer account: ${error.message}`);
  if (!data || !verifyPassword(password, data.salt, data.password_hash) || !data.email_verified)
    return null;
  return toPublicUser(data);
}

export async function getCustomerVerificationStatus(email: string) {
  const { data, error } = await getSupabaseServerClient()
    .from("customer_users")
    .select("email_verified")
    .eq("email", email.toLowerCase())
    .maybeSingle<{ email_verified: boolean }>();
  if (error) throw new Error(`Could not read verification status: ${error.message}`);
  return data ? { emailVerified: data.email_verified } : null;
}

export async function createVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const { data, error } = await getSupabaseServerClient()
    .from("customer_users")
    .update({ verification_token: token })
    .eq("email", email.toLowerCase())
    .eq("email_verified", false)
    .select("email")
    .maybeSingle();
  if (error) throw new Error(`Could not create verification token: ${error.message}`);
  return data ? token : null;
}

export async function verifyEmail(token: string) {
  const { data, error } = await getSupabaseServerClient()
    .from("customer_users")
    .update({ email_verified: true, verification_token: null })
    .eq("verification_token", token)
    .select("email")
    .maybeSingle();
  if (error) throw new Error(`Could not verify email: ${error.message}`);
  return Boolean(data);
}

export async function createPasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const { data, error } = await getSupabaseServerClient()
    .from("customer_users")
    .update({
      reset_token: token,
      reset_token_expires_at: new Date(Date.now() + 3_600_000).toISOString(),
    })
    .eq("email", email.toLowerCase())
    .select("email")
    .maybeSingle();
  if (error) throw new Error(`Could not create password reset token: ${error.message}`);
  return data ? token : null;
}

export async function resetPassword(token: string, password: string) {
  const client = getSupabaseServerClient();
  const { data, error } = await client
    .from("customer_users")
    .select("email, reset_token_expires_at")
    .eq("reset_token", token)
    .maybeSingle<{ email: string; reset_token_expires_at: string | null }>();
  if (error) throw new Error(`Could not read password reset token: ${error.message}`);
  if (!data?.reset_token_expires_at || new Date(data.reset_token_expires_at).getTime() < Date.now())
    return false;
  const salt = crypto.randomBytes(16).toString("hex");
  const { error: updateError } = await client
    .from("customer_users")
    .update({
      password_hash: hashPassword(password, salt),
      salt,
      reset_token: null,
      reset_token_expires_at: null,
    })
    .eq("email", data.email);
  if (updateError) throw new Error(`Could not reset password: ${updateError.message}`);
  return true;
}

export async function createSession(email: string, role: "admin" | "customer") {
  const token = crypto.randomBytes(32).toString("hex");
  const { error } = await getSupabaseServerClient()
    .from("app_sessions")
    .insert({
      token,
      email,
      role,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  if (error) throw new Error(`Could not create session: ${error.message}`);
  return token;
}

export async function getSession(token: string) {
  const { data, error } = await getSupabaseServerClient()
    .from("app_sessions")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle<SessionRow>();
  if (error) throw new Error(`Could not read session: ${error.message}`);
  return data;
}

export async function destroySession(token: string) {
  const { error } = await getSupabaseServerClient()
    .from("app_sessions")
    .delete()
    .eq("token", token);
  if (error) throw new Error(`Could not destroy session: ${error.message}`);
}

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}
function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}
function toPublicUser(user: CustomerRow): AuthUser {
  return {
    email: user.email,
    name: user.name,
    role: "customer",
    emailVerified: user.email_verified,
    createdAt: user.created_at,
  };
}
