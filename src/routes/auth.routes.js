import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Compte deja existant." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, phone, passwordHash });
  return res.status(201).json({ id: user._id, email: user.email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Identifiants invalides." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Identifiants invalides." });

  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET || "",
    { expiresIn: "7d" }
  );

  return res.json({ token });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub).select("-passwordHash");
  return res.json(user);
});

export default router;
