/**
 * Valide req.body avec Zod et remplace le body par les données parsées (types sûrs).
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Donnees invalides.",
        errors: parsed.error.flatten().fieldErrors
      });
    }
    req.body = parsed.data;
    return next();
  };
}
