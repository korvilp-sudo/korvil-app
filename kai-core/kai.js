// ===== K-AI CEREBRO v1.0 =====
const KAI = {

  // MEMORIA RAPIDA DO K-AI
  memoria: {
    nomeUsuario: "Paulo",
    ultimaPagina: "central"
  },

  // FUNÇÃO PRINCIPAL: ENTENDER O COMANDO
  async entender(texto) {
    texto = texto.toLowerCase().trim();
    this.adicionarNaTela("usuario", texto); // mostra o que você disse

    let resposta = "";

    // 1. COMANDOS DE NAVEGAÇÃO
    if (texto.includes("vai para") || texto.includes("vá para") || texto.includes("abre") || texto.includes("ir para")) {
      resposta = this.navegar(texto);
    }
    
    // 2. COMANDOS DE CRIAÇÃO
    else if (texto.includes("cria") || texto.includes("faça") || texto.includes("gere")) {
      resposta = await this.criar(texto);
    }

    // 3. COMANDOS DE COPIA/ANALISE
    else if (texto.includes("copia") || texto.includes("resuma") || texto.includes("analisa")) {
      resposta = this.copiarAnalisar(texto);
    }

    // 4. COMANDOS DE SISTEMA
    else if (texto.includes("oi") || texto.includes("ola")) {
      resposta = `Olá ${this.memoria.nomeUsuario}! No que posso ajudar hoje?`;
    }
    else if (texto.includes("quem é você")) {
      resposta = "Eu sou o K-AI, seu assistente virtual do KORVIL. Posso criar, navegar e analisar coisas pra você.";
    }

    // 5. SE NÃO ENTENDER
    else {
      resposta = "Não entendi direito. Você pode pedir pra eu: Criar, Navegar ou Analisar algo.";
    }

    this.adicionarNaTela("kai", resposta);
    this.falar(resposta); // Fala a resposta
  },

  // ===== AÇÃO 1: NAVEGAR =====
  navegar(comando) {
    if (comando.includes("k-tp") || comando.includes("transformação")) {
      window.parent.irParaKTP();
      return "Abrindo K-TP Projeto Transformação pra você.";
    }
    if (comando.includes("k-alma")) {
      window.parent.abrirTela('kalma');
      return "Indo para K-ALMA.";
    }
    if (comando.includes("central") || comando.includes("inicio")) {
      window.parent.abrirTela('central');
      return "Voltando para a Central KORVIL.";
    }
    if (comando.includes("sistema k")) {
      window.parent.abrirTela('sistema');
      return "Abrindo Sistema K.";
    }
    return "Não encontrei essa página. Quer ir para K-TP, K-ALMA ou Central?";
  },

  // ===== AÇÃO 2: CRIAR =====
  async criar(comando) {
    if (comando.includes("post") || comando.includes("instagram")) {
      return "Ok, vou criar um post para o Instagram do KORVIL. \n\n**Legenda sugerida:**\nTransforme sua vida com o KORVIL. \n#korvil #desenvolvimentohumano #ktp";
    }
    if (comando.includes("texto") || comando.includes("site")) {
      return "Pronto. Aqui está um texto para o site:\n\nO KORVIL é um ecossistema completo de desenvolvimento humano e negócios. Entre e descubra seu potencial.";
    }
    if (comando.includes("roteiro")) {
      return "Roteiro de vídeo pronto:\n1. Abertura 3s\n2. Problema\n3. Solução com KORVIL\n4. Chamada para ação";
    }
    return "O que você quer que eu crie? Post, Texto ou Roteiro?";
  },

  // ===== AÇÃO 3: COPIAR / ANALISAR =====
  copiarAnalisar(comando) {
    if (comando.includes("copia")) {
      navigator.clipboard.writeText(comando.replace("copia", ""));
      return "Texto copiado para a área de transferência.";
    }
    if (comando.includes("resuma")) {
      return "Resumo: O KORVIL é uma plataforma focada em desenvolvimento humano, negócios e serviços com a IA K-AI para ajudar.";
    }
    if (comando.includes("analisa")) {
      return "Envie a imagem ou arquivo pra mim com o botão 📎 que eu analiso pra você.";
    }
    return "Posso copiar ou resumir algo pra você.";
  },

  // ===== FUNÇÃO DE FALA =====
  falar(texto) {
    if ('speechSynthesis' in window) {
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = 'pt-BR';
      fala.rate = 1.1;
      speechSynthesis.speak(fala);
    }
  },

  // ===== MOSTRAR NA TELA DO CHAT =====
  adicionarNaTela(quem, texto) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    const msg = document.createElement('div');
    msg.classList.add('msg', quem);
    msg.innerHTML = `<b>${quem === 'kai' ? 'K-AI' : 'Você'}:</b> ${texto.replace(/\n/g, '<br>')}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight; // rola pra baixo
  }

};
