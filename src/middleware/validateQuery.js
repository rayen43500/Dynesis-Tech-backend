export function validateQuery(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Parametres invalides.",
        errors: parsed.error.flatten().fieldErrors
      });
    }
    req.query = parsed.data;
    return next();
  };
}
