require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Pega token do .env
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Serve todos arquivos estáticos de kai-kbd
app.use(express.static(path.join(__dirname, 'kai-core/kai-kbd')));

// Rota principal manda o kai-kbd.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'kai-core/kai-kbd/kai-kbd.html'));
});

// Rota de teste pra ver se o token carregou
app.get('/api/status', (req, res) => {
  res.json({ ok: true, token: GITHUB_TOKEN ? "Carregado" : "Faltando" });
});

app.listen(PORT, () => console.log(`🚀 KORVIL rodando em http://localhost:${PORT}`));
