// ============= K-AI UPDATER - A PONTE =============
// COLE SEU TOKEN AQUI 1 VEZ SÓ. ELE SALVA E NUNCA MAIS PERGUNTA
const TOKEN = localStorage.getItem('gh_token') || prompt("Cole token GitHub 1 vez:");
localStorage.setItem('gh_token', TOKEN);

const REPO = "korvilp-sudo/korvil-app";
const BRANCH = "main";

class KAIUpdater {
  // FUNÇÃO QUE A PONTE USA PRA ENVIAR PRO GITHUB
  async enviarArquivo(caminho, conteudo){
    const url = `https://api.github.com/repos/${REPO}/contents/${caminho}`;
    
    // 1. Pega SHA do arquivo pra poder sobrescrever
    const atual = await fetch(url, {headers: {Authorization: `token ${TOKEN}`}});
    const sha = atual.ok ? (await atual.json()).sha : null;

    // 2. Envia/Atualiza arquivo
    await fetch(url, {
      method: 'PUT',
      headers: {Authorization: `token ${TOKEN}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        message: `Auto-update by K-AI`,
        content: btoa(unescape(encodeURIComponent(conteudo))), // converte pra base64
        sha: sha,
        branch: BRANCH
      })
    });
    console.log(`[PONTE] Enviado: ${caminho}`);
  }
}
window.PONTE = new KAIUpdater();
