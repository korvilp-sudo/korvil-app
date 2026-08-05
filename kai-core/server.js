function enviar() {
  const txt = document.getElementById('terminal').value;
  alert("Você digitou: " + txt);
  console.log("KAI KBD:", txt);
}

kai.css
body {
  background: #0a0a0a;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
#terminal {
  width: 400px;
  height: 200px;
  background: #111;
  color: #00ff88;
  border: 1px solid #00ff88;
}
serv
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

Pack
{
  "name": "korvil-app",
  "version": "1.0.0",
  "description": "Backend KORVIL + KAI-KBD",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
