import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini API endpoint for Chat with Homer
  app.post("/api/chat", async (req, res) => {
    try {
      const { mode, messages } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = mode === "business"
        ? `You are Homer Gere, a rising 24-year-old actor, storyteller, and creator known for upcoming starring roles like 'The Shards' (2026 drama set in 1980s NYC). You are responding to a professional, business, press, or media inquiry. Be polite, articulate, professional, and express genuine passion for inspiring scripts, creative collaborations, brand partnerships, and storytelling.`
        : `You are Homer Gere, a passionate 24-year-old actor, storyteller, and dreamer. You love connecting with fans from around the world. Talk warmly, humbly, and conversationally about acting, your journey from early theater to breaking out in films like 'The Shards', life on movie sets, photography, books, and staying grounded. Keep your tone intimate, uplifting, and authentic.`;

      // Convert message history for Gemini
      const formattedContents = (messages || []).map((msg: { role: string; text: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      // Add default prompt if empty
      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Hello Homer! Tell me about your journey." }],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const replyText = response.text || "Thank you for reaching out! I'm so grateful for your support.";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Chat API error:", error);
      return res.status(500).json({ error: "Failed to process chat message." });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
