import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";
import { PortfolioProject, Review, FAQ, NewsletterSubscriber } from "./models/Content.js";
import { QuoteRequest } from "./models/QuoteRequest.js";
import { ContactMessage } from "./models/ContactMessage.js";
import { Subscription } from "./models/Subscription.js";

dotenv.config();

const reset = process.env.SEED_RESET === "true";
const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@dynesis.tech";
const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
const clientEmail = process.env.SEED_CLIENT_EMAIL || "client@dynesis.tech";
const clientPassword = process.env.SEED_CLIENT_PASSWORD || "Client123!";

async function upsertUser({ firstName, lastName, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { email },
    {
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      privacyAccepted: true,
      emailVerified: true,
      emailVerifyTokenHash: null,
      emailVerifyExpires: null,
      passwordResetTokenHash: null,
      passwordResetExpires: null
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function main() {
  await connectDb();

  if (reset) {
    await Promise.all([
      User.deleteMany({}),
      PortfolioProject.deleteMany({}),
      Review.deleteMany({}),
      FAQ.deleteMany({}),
      NewsletterSubscriber.deleteMany({}),
      QuoteRequest.deleteMany({}),
      ContactMessage.deleteMany({}),
      Subscription.deleteMany({})
    ]);
  }

  const adminUser = await upsertUser({
    firstName: "Admin",
    lastName: "Dynesis",
    email: adminEmail,
    password: adminPassword,
    role: "admin"
  });

  const clientUser = await upsertUser({
    firstName: "Client",
    lastName: "Demo",
    email: clientEmail,
    password: clientPassword,
    role: "client"
  });

  await PortfolioProject.updateOne(
    { title: "Plateforme IA Retail" },
    {
      title: "Plateforme IA Retail",
      imageUrl: "/images/project-1.jpg",
      mission: "Automatiser la prediction des ventes et le reporting.",
      technologies: ["Node.js", "React", "MongoDB"],
      result: "+22% de conversion en 3 mois."
    },
    { upsert: true }
  );

  await Review.updateOne(
    { author: "Sarah M." },
    { author: "Sarah M.", rating: 5, comment: "Equipe reactive et delivery propre.", isApproved: true },
    { upsert: true }
  );

  await FAQ.updateOne(
    { question: "Quels sont vos delais moyens ?" },
    { question: "Quels sont vos delais moyens ?", answer: "Entre 2 et 6 semaines selon la mission.", isPublished: true },
    { upsert: true }
  );

  await NewsletterSubscriber.updateOne(
    { email: "newsletter@dynesis.tech" },
    { email: "newsletter@dynesis.tech", isActive: true },
    { upsert: true }
  );

  await QuoteRequest.updateOne(
    { email: "prospect@dynesis.tech" },
    {
      firstName: "Alex",
      lastName: "Prospect",
      email: "prospect@dynesis.tech",
      phone: "+33 6 12 34 56 78",
      industry: "E-commerce",
      projectType: "Application web",
      estimatedBudget: "15000-25000",
      message: "Besoin d'une refonte avec tunnel de conversion.",
      status: "nouvelle"
    },
    { upsert: true }
  );

  await ContactMessage.updateOne(
    { email: "contact@dynesis.tech" },
    {
      name: "Lina B.",
      email: "contact@dynesis.tech",
      phone: "+33 7 98 76 54 32",
      company: "TechnoLab",
      requestType: "project",
      message: "Nous voulons un devis pour une app mobile.",
      projectDetails: "App de reservation B2B.",
      subscribeNewsletter: true,
      status: "new"
    },
    { upsert: true }
  );

  await Subscription.updateOne(
    { userId: clientUser._id },
    {
      userId: clientUser._id,
      plan: "Business",
      status: "actif",
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 23)
    },
    { upsert: true }
  );

  // eslint-disable-next-line no-console
  console.log("Seed complete", {
    adminEmail,
    adminPassword,
    clientEmail,
    clientPassword
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed", error);
    process.exit(1);
  });
