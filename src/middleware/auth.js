import jwt from "jsonwebtoken";

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error("JWT_SECRET manquant.");
  }
  return s;
}

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret(), {
      algorithms: ["HS256"]
    });
    if (!payload.sub || typeof payload.sub !== "string") {
      return res.status(401).json({ message: "Token invalide." });
    }
    req.user = payload;
    return next();
  } catch (e) {
    if (e.message === "JWT_SECRET manquant.") {
      // eslint-disable-next-line no-console
      console.error(e);
      return res.status(500).json({ message: "Configuration serveur incorrecte." });
    }
    return res.status(401).json({ message: "Token invalide." });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acces refuse." });
  }
  return next();
}
