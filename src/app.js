import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import paymentWebhookRoutes from "./routes/paymentWebhook.routes.js";
import contentRoutes from "./routes/content.routes.js";
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";

export const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS: origin not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dynesis-tech-api" });
});

// Stripe webhook doit recevoir le body brut avant express.json()
app.use("/api/payments/webhook", paymentWebhookRoutes);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
