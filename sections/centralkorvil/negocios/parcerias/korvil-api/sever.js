server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cors());

// MUDA AQUI: Pega o token da variavel do Render, não do código
const TOKEN = process.env.GITHUB_TOKEN
const REPO = "korvil-sudo/korvil-app"

const MAPA_PASTAS = {
    servicos: "sections/sistemak/servicos/",
    produtos: "sections/sistemak/produtos/",
    parceiro: "parceiros/",
    css: "assets/css/",
    js: "assets/js/"
}

app.post('/upload', async (req,res)=>{
    try{
        const {tipo, pasta, arquivo, codigo} = req.body;
        const caminho = MAPA_PASTAS[tipo] + pasta + '/' + arquivo;
        const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${caminho}`,{
            method: 'PUT',
            headers: {'Authorization': `token ${TOKEN}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                message: `KORVIL BOT: Adicionar ${caminho}`,
                content: Buffer.from(codigo).toString('base64')
            })
        });
        res.json(await r.json());
    }catch(e){
        res.status(500).json({erro: e.message});
    }
});

// IMPORTANTE PRA RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));
