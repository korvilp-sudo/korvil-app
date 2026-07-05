
const Cria = {
  async executar(comando) {
    comando = comando.toLowerCase();

    // 1. CRIAR POST PARA REDES
    if (comando.includes("post") || comando.includes("instagram") || comando.includes("legenda")) {
      const tema = comando.replace(/cria|faça|gere|post|para/gi, "").trim() || "KORVIL";
      return `**Post KORVIL - Tema: ${tema}**\n\nVocê não nasceu pra viver no automático.\nO KORVIL existe pra destravar seu potencial e transformar conhecimento em resultado.\n\nO futuro pertence a quem age hoje.\n\n#korvil #desenvolvimentohumano #empreendedorismo #ktp #kai`;
    }

    // 2. CRIAR TEXTO PARA SITE/LANDING
    if (comando.includes("texto") || comando.includes("site") || comando.includes("landing")) {
      const tema = comando.replace(/cria|faça|gere|texto|para/gi, "").trim() || "KORVIL";
      return `**Texto para Site - ${tema}**\n\nBem-vindo ao KORVIL.\nAqui você encontra o método, as ferramentas e a comunidade para sair do zero e construir liberdade através de negócios digitais e desenvolvimento humano.\n\nChegou a hora de virar a chave.`;
    }

    // 3. CRIAR ROTEIRO DE VÍDEO
    if (comando.includes("roteiro") || comando.includes("vídeo") || comando.includes("reels")) {
      const tema = comando.replace(/cria|faça|gere|roteiro|de/gi, "").trim() || "Vendas";
      return `**Roteiro Reels 60s - ${tema}**\n\n[0-3s HOOK]: "Você está cometendo esse erro e nem sabe!"\n[3-15s PROBLEMA]: Mostrar a dor do ${tema}\n[15-45s SOLUÇÃO]: Apresentar o método KORVIL/K-TP\n[45-60s CTA]: "Comenta KORVIL que eu te mando o link"`;
    }

    // 4. CRIAR IMAGEM COM IA - PRONTO PRA CONECTAR
    if (comando.includes("imagem") || comando.includes("arte") || comando.includes("banner")) {
      const prompt = comando.replace(/cria|faça|gere|imagem|de/gi, "").trim();
      await this.gerarImagem(prompt);
      return `Gerando imagem: "${prompt}". Aguarde 5 segundos...`;
    }

    // 5. CRIAR EMAIL
    if (comando.includes("email") || comando.includes("e-mail")) {
      return `**Email KORVIL**\n\nAssunto: Sua virada de chave começa hoje\nOlá,\nVocê foi escolhido pra fazer parte do KORVIL. A comunidade que transforma vidas através de ação.\n\nClique aqui e entre: [LINK]\n\nAbraços,\nEquipe KORVIL`;
    }

    return "Posso Criar: Post, Texto, Roteiro, Imagem, Email. Me diga qual e o tema.";
  },

  // FUNÇÃO PRA CONECTAR COM IA DE IMAGEM DEPOIS
  async gerarImagem(prompt) {
    console.log("Gerando imagem com prompt:", prompt);
    
    // AQUI ENTRA SUA API: OPENAI DALL-E, GEMINI, STABLE DIFFUSION
    // const response = await fetch('SUA_API_DE_IMAGEM', { method: 'POST', body: JSON.stringify({prompt}) })
    
    // Por enquanto simula
    setTimeout(() => {
      KAI.adicionarNaTela("kai", `Imagem gerada! [imagem_simulada_de_${prompt}]`);
    }, 3000);
  }
}
