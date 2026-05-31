import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo() {
  if (!env.MONGO_URI) throw new Error('MONGO_URI is missing');

  mongoose.set('strictQuery', true);

  // Mongoose 8 works with the default driver options well; keep this minimal.
  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000
  });
}

