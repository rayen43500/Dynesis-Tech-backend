import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

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
