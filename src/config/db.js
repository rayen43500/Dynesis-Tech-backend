import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI missing in environment.");
  }
  await mongoose.connect(uri);
}
