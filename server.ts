import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gemini AI Helper with lazy initialization
let genAI: GoogleGenAI | null = null;

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API Gemini non configurée. Veuillez l'ajouter dans les paramètres du projet.");
  }
  if (!genAI) {
    genAI = new GoogleGenAI(apiKey);
  }
  return genAI;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    
    // Identifiants par défaut pour le démo
    if (email === "admin@precieuse.com" && password === "Empire2026") {
      return res.json({
        success: true,
        user: {
          id: "1",
          name: "Mlle Précieuse",
          email: "admin@precieuse.com",
          role: "super_admin",
          image: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=200"
        }
      });
    }

    res.status(401).json({
      success: false,
      message: "Identifiants impériaux incorrects"
    });
  });

  // AI Generation Route
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, model: modelName = "gemini-1.5-flash" } = req.body;
      
      const ai = getGenAI();
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la génération AI." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

startServer();
