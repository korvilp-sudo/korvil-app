require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const KAI_TOKEN = process.env.KAI_TOKEN; // <- MUDOU AQUI

app.get('/api/buscar/:nome', async (req, res) => {
  const nome = req.params.nome;
  
  const resposta = await fetch(`https://api.github.com/search/repositories?q=${nome}`, {
    headers: {
      'Authorization': `Bearer ${KAI_TOKEN}`, // <- E AQUI
      'User-Agent': 'KAI-APP'
    }
  });

  const dados = await resposta.json();
  res.json(dados);
});

app.listen(PORT, () => console.log(`🚀 KAI rodando em http://localhost:${PORT}`));

env:
  KAI_TOKEN: ${{ secrets.KAI_TOKEN }} # <- MUDOU AQUI
