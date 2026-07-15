import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const OPENAI_KEY = "sk-SUA_CHAVE_AQUI"; // fica escondida aqui

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
