import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "");
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide." });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acces refuse." });
  }
  return next();
}
