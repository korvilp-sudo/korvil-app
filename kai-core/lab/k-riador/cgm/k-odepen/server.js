import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const OPENAI_KEY = "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"; // fica escondida aqui

app.post("/gerar", async (req, res) => {
  const { prompt } = req.body;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{role: "user", content: `Retorne APENAS HTML completo. Pedido: ${prompt}`}]
    })
  });
  const data = await r.json();
  res.json({ code: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
