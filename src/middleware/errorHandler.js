export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ message: "Erreur serveur." });
}
