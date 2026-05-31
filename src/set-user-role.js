import { connectMongo } from './config/mongo.js';
import { User } from './modules/users/models/User.model.js';

async function main() {
  await connectMongo();

  const email = process.env.SEED_TARGET_EMAIL;
  const role = process.env.SEED_TARGET_ROLE;

  if (!email || !role) {
    // eslint-disable-next-line no-console
    console.log('Skipping set-user-role: set SEED_TARGET_EMAIL and SEED_TARGET_ROLE to update a user.');
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    // eslint-disable-next-line no-console
    console.log('No user found for SEED_TARGET_EMAIL');
    return;
  }

  if (!['admin', 'client'].includes(role)) {
    // eslint-disable-next-line no-console
    console.log('Invalid SEED_TARGET_ROLE (expected admin or client)');
    return;
  }

  user.role = role;
  await user.save();

  // eslint-disable-next-line no-console
  console.log(`Updated role for ${email} -> ${role}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => setTimeout(() => process.exit(0), 250).unref?.());

