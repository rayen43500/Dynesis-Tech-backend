import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { generateSecureToken, hashToken } from "../utils/tokens.js";
import * as emailService from "./email.service.js";

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error("JWT_SECRET manquant.");
  }
  return s;
}

const VERIFY_MS = 48 * 60 * 60 * 1000;
const RESET_MS = 60 * 60 * 1000;

function withDevVerifyUrl(payload, emailResult) {
  if (process.env.NODE_ENV === "production" || !emailResult?.dev || !emailResult.verifyUrl) {
    return payload;
  }
  return {
    ...payload,
    devVerifyUrl: emailResult.verifyUrl,
    emailDelivery: "dev"
  };
}

export async function registerUser(data) {
  const exists = await User.findOne({ email: data.email });
  if (exists) {
    const err = new Error("Compte deja existant.");
    err.statusCode = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(data.password, 12);
  const verifyToken = generateSecureToken();
  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || undefined,
    passwordHash,
    emailVerified: false,
    emailVerifyTokenHash: hashToken(verifyToken),
    emailVerifyExpires: new Date(Date.now() + VERIFY_MS)
  });

  let emailResult = { dev: true };
  try {
    emailResult = await emailService.sendVerifyEmail(user.email, verifyToken);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Echec envoi email verification:", e);
  }

  return withDevVerifyUrl(
    {
      id: user._id,
      email: user.email,
      message: emailResult.sent
        ? "Compte cree. Verifiez votre boite email pour activer le compte."
        : "Compte cree. Configurez SMTP sur le serveur pour recevoir l'email (voir console backend en dev)."
    },
    emailResult
  );
}

export async function loginUser(data) {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    const err = new Error("Identifiants invalides.");
    err.statusCode = 401;
    throw err;
  }
  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) {
    const err = new Error("Identifiants invalides.");
    err.statusCode = 401;
    throw err;
  }
  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    jwtSecret(),
    { expiresIn: "7d", algorithm: "HS256" }
  );
  // false = compte non verifie ; undefined (anciens comptes) = considere verifie
  const emailVerified = user.emailVerified !== false;
  return { token, emailVerified, role: user.role };
}

export async function getMe(userId) {
  return User.findById(userId).select("-passwordHash -emailVerifyTokenHash -passwordResetTokenHash");
}

export async function verifyEmailWithToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") {
    const err = new Error("Token manquant.");
    err.statusCode = 400;
    throw err;
  }
  const tokenHash = hashToken(rawToken);
  const user = await User.findOne({
    emailVerifyTokenHash: tokenHash,
    emailVerifyExpires: { $gt: new Date() }
  });
  if (!user) {
    const err = new Error("Lien invalide ou expire.");
    err.statusCode = 400;
    throw err;
  }
  user.emailVerified = true;
  user.emailVerifyTokenHash = null;
  user.emailVerifyExpires = null;
  await user.save();
  return { message: "Email verifie. Vous pouvez vous connecter." };
}

export async function resendVerificationEmail(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { message: "Si un compte existe, un email a ete envoye." };
  }
  if (user.emailVerified) {
    return { message: "Si un compte existe, un email a ete envoye." };
  }
  const verifyToken = generateSecureToken();
  user.emailVerifyTokenHash = hashToken(verifyToken);
  user.emailVerifyExpires = new Date(Date.now() + VERIFY_MS);
  await user.save();
  let emailResult = { dev: true };
  try {
    emailResult = await emailService.sendVerifyEmail(user.email, verifyToken);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Echec envoi email verification:", e);
  }
  return withDevVerifyUrl({ message: "Si un compte existe, un email a ete envoye." }, emailResult);
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  const generic = { message: "Si un compte existe, un email a ete envoye." };
  if (!user) {
    return generic;
  }
  const resetToken = generateSecureToken();
  user.passwordResetTokenHash = hashToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_MS);
  await user.save();
  await emailService.sendPasswordResetEmail(user.email, resetToken).catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Echec envoi reset password:", e);
  });
  return generic;
}

export async function resetPasswordWithToken(rawToken, newPassword) {
  if (!rawToken || typeof rawToken !== "string") {
    const err = new Error("Token manquant.");
    err.statusCode = 400;
    throw err;
  }
  const tokenHash = hashToken(rawToken);
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() }
  });
  if (!user) {
    const err = new Error("Lien invalide ou expire.");
    err.statusCode = 400;
    throw err;
  }
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  user.emailVerifyTokenHash = null;
  user.emailVerifyExpires = null;
  await user.save();
  return { message: "Mot de passe mis a jour. Vous pouvez vous connecter." };
}
