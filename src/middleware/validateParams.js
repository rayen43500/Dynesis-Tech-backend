import { z } from "zod";

const mongoIdSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i)
});

export function validateMongoIdParam(req, res, next) {
  const parsed = mongoIdSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ message: "Identifiant invalide." });
  }
  return next();
}
