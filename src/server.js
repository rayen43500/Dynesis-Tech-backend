import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

if (process.env.NODE_ENV === "production") {
  const required = ["MONGO_URI", "JWT_SECRET", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error("Variables d'environnement manquantes:", missing.join(", "));
    process.exit(1);
  }
}

const port = Number(process.env.PORT || 5000);

connectDb()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API Dynesis Tech en ecoute sur http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Erreur connexion base de donnees:", error);
    process.exit(1);
  });
