import { connectMongo } from './config/mongo.js';
import { env } from './config/env.js';
import { User } from './modules/users/models/User.model.js';
import { hashPassword } from './shared/security/password.js';

async function main() {
  await connectMongo();

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminDisplayName = process.env.SEED_ADMIN_DISPLAY_NAME || 'Admin';

  if (!adminEmail || !adminPassword) {
    // eslint-disable-next-line no-console
    console.log('Skipping seed: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create an admin user.');
    return;
  }

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log('Seed admin already exists.');
    return;
  }

  await User.create({
    email: adminEmail,
    role: 'admin',
    displayName: adminDisplayName,
    passwordHash: await hashPassword(adminPassword)
  });

  // eslint-disable-next-line no-console
  console.log('Seed admin created.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // best-effort close
    // eslint-disable-next-line no-process-exit
    setTimeout(() => process.exit(0), 250).unref?.();
  });

