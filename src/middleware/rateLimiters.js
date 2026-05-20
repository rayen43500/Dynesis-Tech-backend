import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 2000 : 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de requetes. Reessayez plus tard." }
});

/** Login / inscription / reset uniquement — pas sur GET /me */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Trop de tentatives de connexion. Reessayez plus tard." }
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de messages envoyes depuis cette adresse." }
});

export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
