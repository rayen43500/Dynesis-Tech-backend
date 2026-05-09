import { z } from "zod";

const projectTypeEnum = z.enum([
  "Machine Learning",
  "Intelligence Artificielle",
  "Application web",
  "Application mobile",
  "Site internet",
  "Autres"
]);

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional(),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128)
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  requestType: z.enum(["quote", "invoice", "email", "project", "support"]).default("quote"),
  message: z.string().trim().min(1).max(8000),
  invoiceNumber: z.string().trim().max(120).optional().default(""),
  projectDetails: z.string().trim().max(8000).optional().default(""),
  subscribeNewsletter: z.boolean().optional().default(false)
});

export const quoteCreateSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(1).max(40),
  industry: z.string().trim().min(1).max(120),
  projectType: projectTypeEnum,
  estimatedBudget: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(8000)
});

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().email().max(320)
});

export const reviewCreateSchema = z.object({
  author: z.string().trim().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(4000)
});

export const moderateReviewSchema = z.object({
  isApproved: z.coerce.boolean()
});

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  imageUrl: z.union([z.string().url().max(2000), z.literal("")]).optional(),
  mission: z.string().trim().max(2000).optional(),
  technologies: z.array(z.string().trim().max(80)).max(40).optional(),
  result: z.string().trim().max(2000).optional()
});

export const faqCreateSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(8000),
  isPublished: z.boolean().optional()
});

export const profileUpdateSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    phone: z.string().trim().max(40).optional(),
    privacyAccepted: z.boolean().optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: "Aucun champ fourni." });

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128)
});

export const selectPlanSchema = z.object({
  plan: z.string().trim().min(1).max(80)
});

export const checkoutPlanSchema = z.object({
  plan: z.enum(["Starter", "Business", "Premium"])
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(320)
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(128),
  newPassword: z.string().min(8).max(128)
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().email().max(320)
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(20).max(128)
});

export const contactStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"])
});

export const portfolioUpdateSchema = portfolioProjectSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: "Aucun champ fourni." });

export const adminContactsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  skip: z.coerce.number().int().min(0).max(10_000).optional().default(0)
});
