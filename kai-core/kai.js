// ===== K-AI CEREBRO v1.1 COM VOZ =====
const KAI = {

  // CONFIGURAÇÕES DE VOZ DO K-AI
  configVoz: {
    modo: "ilimitada", // "ilimitada" ou "limitada"
    genero: "masculino", // "masculino" ou "feminino"
    vozSelecionada: null // vai guardar a voz do navegador
  },

  memoria: {
    nomeUsuario: "Paulo",
    ultimaPagina: "central"
  },

  // INICIAR O K-AI E PEGAR AS VOZES DO NAVEGADOR
  iniciar() {
    this.carregarVozes();
    // Quando as vozes carregarem
    speechSynthesis.onvoiceschanged = () => this.carregarVozes();
  },

  carregarVozes() {
    const vozes = speechSynthesis.getVoices();
    // Procura voz masculina BR por padrão "Corvo robótico"
    this.configVoz.vozSelecionada = vozes.find(v => 
      v.lang === 'pt-BR' && v.name.toLowerCase().includes('male')
    ) || vozes.find(v => v.lang === 'pt-BR' && v.gender === 'male')
      || vozes.find(v => v.lang === 'pt-BR'); // fallback
  },

  // FUNÇÃO PRA MUDAR A VOZ
  mudarVoz(modo, genero) {
    this.configVoz.modo = modo;
    this.configVoz.genero = genero;
    
    const vozes = speechSynthesis.getVoices();
    if (genero === "masculino") {
      this.configVoz.vozSelecionada = vozes.find(v => v.lang === 'pt-BR' && v.name.toLowerCase().includes('male'))
        || vozes.find(v => v.lang === 'pt-BR' && v.gender === 'male')
        || vozes.find(v => v.lang === 'pt-BR');
    } else {
      this.configVoz.vozSelecionada = vozes.find(v => v.lang === 'pt-BR' && v.name.toLowerCase().includes('female'))
        || vozes.find(v => v.lang === 'pt-BR' && v.gender === 'female')
        || vozes.find(v => v.lang === 'pt-BR');
    }
    
    this.adicionarNaTela("kai", `Voz alterada para ${genero} - Modo ${modo}`);
  },

  // FUNÇÃO PRINCIPAL: ENTENDER O COMANDO
  async entender(texto) {
    texto = texto.toLowerCase().trim();
    this.adicionarNaTela("usuario", texto);

    let resposta = "";

    // COMANDO SECRETO PRA TROCAR VOZ
    if (texto.includes("mudar voz para masculino")) {
      this.mudarVoz(this.configVoz.modo, "masculino");
      return;
    }
    if (texto.includes("mudar voz para feminino")) {
      this.mudarVoz(this.configVoz.modo, "feminino");
      return;
    }
    if (texto.includes("modo ilimitado")) {
      this.mudarVoz("ilimitada", this.configVoz.genero);
      return;
    }
    if (texto.includes("modo limitado")) {
      this.mudarVoz("limitada", this.configVoz.genero);
      return;
    }

    // 1. NAVEGAÇÃO
    if (texto.includes("vai para") || texto.includes("abre")) {
      resposta = this.navegar(texto);
    }
    // 2. CRIAÇÃO
    else if (texto.includes("cria") || texto.includes("faça")) {
      resposta = await this.criar(texto);
    }
    // 3. COPIA/ANALISE
    else if (texto.includes("copia") || texto.includes("resuma")) {
      resposta = this.copiarAnalisar(texto);
    }
    // 4. SISTEMA
    else if (texto.includes("oi") || texto.includes("ola")) {
      resposta = `Olá ${this.memoria.nomeUsuario}! K-AI na área. Modo ${this.configVoz.modo}.`;
    }
    else {
      resposta = "Não entendi. Peça pra eu Criar, Navegar ou Analisar.";
    }

    this.adicionarNaTela("kai", resposta);
    this.falar(resposta);
  },

  navegar(comando) {
    if (comando.includes("k-tp")) { window.parent.irParaKTP(); return "Abrindo K-TP."; }
    if (comando.includes("k-alma")) { window.parent.abrirTela('kalma'); return "Indo para K-ALMA."; }
    if (comando.includes("central")) { window.parent.abrirTela('central'); return "Voltando para Central."; }
    return "Não encontrei essa página.";
  },

  async criar(comando) {
    if (comando.includes("post")) {
      return "Post criado: Transforme sua vida com o KORVIL. #korvil #ktp";
    }
    return "O que você quer que eu crie?";
  },

  copiarAnalisar(comando) {
    if (comando.includes("copia")) {
      navigator.clipboard.writeText(comando.replace("copia", ""));
      return "Texto copiado.";
    }
    return "Posso copiar ou resumir.";
  },

  // ===== FUNÇÃO DE FALA ATUALIZADA =====
  falar(texto) {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // para fala anterior
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = 'pt-BR';
      fala.voice = this.configVoz.vozSelecionada; // USA A VOZ ESCOLHIDA
      fala.rate = this.configVoz.modo === "ilimitada" ? 1.2 : 0.9; // Ilimitada fala mais rapido
      fala.pitch = this.configVoz.genero === "masculino" ? 0.8 : 1.2; // Masculino grave
      fala.volume = 1;
      speechSynthesis.speak(fala);
    }
  },

  adicionarNaTela(quem, texto) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    const msg = document.createElement('div');
    msg.classList.add('msg', quem);
    msg.innerHTML = `<b>${quem === 'kai' ? 'K-AI' : 'Você'}:</b> ${texto.replace(/\n/g, '<br>')}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

};

// INICIA O K-AI QUANDO CARREGAR A PAGINA
window.onload = () => KAI.iniciar();
