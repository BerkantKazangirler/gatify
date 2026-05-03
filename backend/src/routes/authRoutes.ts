import { Router } from "express";
import { registerUser, loginUser } from "../../services/authService.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, citizenId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Eksik bilgi gönderildi." });
    }

    const result = await registerUser({ name, email, password, citizenId });
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Kayıt hatası:", error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-posta ve şifre zorunludur." });
    }

    const result = await loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    console.error("Giriş hatası:", error);
    res.status(401).json({ error: error.message });
  }
});

export default router;
