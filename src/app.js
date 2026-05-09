import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import authRoutes from "./routes/auth.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import paymentWebhookRoutes from "./routes/paymentWebhook.routes.js";
import contentRoutes from "./routes/content.routes.js";
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  apiLimiter,
  authLimiter,
  contactLimiter,
  webhookLimiter
} from "./middleware/rateLimiters.js";

export const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
}

const rawOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((s) => normalizeOrigin(s.trim()))
  .filter(Boolean);
const allowAllOrigins = rawOrigins.includes("*");
const allowedOrigins = allowAllOrigins ? [] : rawOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowAllOrigins) return callback(null, true);
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
    optionsSuccessStatus: 204
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dynesis-tech-api" });
});

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "dynesis-tech-api", status: "ready" });
});

app.use("/api/payments/webhook", webhookLimiter, paymentWebhookRoutes);

app.use(express.json({ limit: "100kb" }));
app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[mongo-sanitize] Cle suspecte supprimee: ${key} ${req.method} ${req.path}`);
      }
    }
  })
);

app.use("/api", apiLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Non trouve." });
});

app.use(errorHandler);
