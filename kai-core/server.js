require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({limit: '10mb'}));

const KAI_TOKEN = process.env.KAI_TOKEN;
const OWNER = "korvilp-sudo"; // <- Troca pelo seu user
const REPO = "kai-core";      // <- Troca pelo nome do repo

const GITHUB_API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const HEADERS = {
  'Authorization': `Bearer ${KAI_TOKEN}`,
  'User-Agent': 'KAI-KBD',
  'Accept': 'application/vnd.github.v3+json'
};

// 1. BUSCAR ESTRUTURA DE PASTAS/ARQUIVOS
app.get('/api/estrutura', async (req, res) => {
  try {
    const resposta = await fetch(`${GITHUB_API}/git/trees/main?recursive=1`, { headers: HEADERS });
    const dados = await resposta.json();
    res.json(dados.tree); // retorna todos arquivos e pastas
  } catch(e) { res.status(500).json({erro: e.message}) }
});

// 2. LER CONTEÚDO DE UM ARQUIVO
app.get('/api/ler/:caminho(*)', async (req, res) => {
  try {
    const caminho = req.params.caminho;
    const resposta = await fetch(`${GITHUB_API}/contents/${caminho}`, { headers: HEADERS });
    const dados = await resposta.json();
    const conteudo = Buffer.from(dados.content, 'base64').toString('utf8');
    res.json({conteudo, sha: dados.sha}); // sha é pra editar/deletar
  } catch(e) { res.status(500).json({erro: e.message}) }
});

// 3. CRIAR/ATUALIZAR ARQUIVO - LÓGICA RÁPIDA
app.put('/api/salvar/:caminho(*)', async (req, res) => {
  try {
    const caminho = req.params.caminho;
    const {conteudo, sha, mensagem} = req.body;
    const body = {
      message: mensagem || `KAI-KBD: Atualizando ${caminho}`,
      content: Buffer.from(conteudo).toString('base64'),
      sha: sha // se não tiver sha, ele cria. Se tiver, ele atualiza
    }
    const resposta = await fetch(`${GITHUB_API}/contents/${caminho}`, {
      method: 'PUT', headers: HEADERS, body: JSON.stringify(body)
    });
    res.json(await resposta.json());
  } catch(e) { res.status(500).json({erro: e.message}) }
});

// 4. DELETAR ARQUIVO
app.delete('/api/deletar/:caminho(*)', async (req, res) => {
  try {
    const caminho = req.params.caminho;
    const {sha, mensagem} = req.body;
    const body = {
      message: mensagem || `KAI-KBD: Deletando ${caminho}`,
      sha: sha
    }
    const resposta = await fetch(`${GITHUB_API}/contents/${caminho}`, {
      method: 'DELETE', headers: HEADERS, body: JSON.stringify(body)
    });
    res.json(await resposta.json());
  } catch(e) { res.status(500).json({erro: e.message}) }
});

app.listen(PORT, () => console.log(`🚀 KAI-KBD rodando em http://localhost:${PORT}`));
