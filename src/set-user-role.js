import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";

dotenv.config();

const email = (process.argv[2] || "").trim().toLowerCase();
const role = (process.argv[3] || "admin").trim();

if (!email || !["admin", "client"].includes(role)) {
  // eslint-disable-next-line no-console
  console.error("Usage: node src/set-user-role.js <email> [admin|client]");
  process.exit(1);
}

async function main() {
  await connectDb();
  const user = await User.findOneAndUpdate(
    { email },
    { role, emailVerified: true },
    { new: true }
  );
  if (!user) {
    // eslint-disable-next-line no-console
    console.error(`Aucun utilisateur trouvé pour: ${email}`);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`OK — ${user.email} → role: ${user.role}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
