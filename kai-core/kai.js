// ===== K-AI CEREBRO v2.0 JARVIS 3D =====
const KAI = {
  memoria: { 
    nomeUsuario: "Chefe", 
    ultimaPagina: "central",
    contexto: []
  },
  configVoz: { 
    modo: "ilimitada", 
    genero: "masculino", 
    vozSelecionada: null,
    velocidade: 1.1
  },

  // 1. INICIAR K-AI
  iniciar() {
    console.log("K-AI Jarvis Iniciado");
    this.carregarVozes();
    speechSynthesis.onvoiceschanged = () => this.carregarVozes();
    Sistema.carregar(); // Carrega memória salva
    
    const nomeSalvo = localStorage.getItem('kai_nomeUsuario');
    if(nomeSalvo) this.memoria.nomeUsuario = nomeSalvo;

    this.adicionarNaTela("kai", `Sistemas online. Olá ${this.memoria.nomeUsuario}. K-AI Jarvis pronto.`);
    this.falar(`Sistemas online. Olá ${this.memoria.nomeUsuario}`);
  },

  // 2. CARREGAR VOZES PT-BR
  carregarVozes() {
    const vozes = speechSynthesis.getVoices();
    this.configVoz.vozSelecionada = vozes.find(v => 
      v.lang === 'pt-BR' && 
      (this.configVoz.genero==="masculino" ? v.name.toLowerCase().includes('male') : v.name.toLowerCase().includes('female'))
    ) || vozes.find(v => v.lang === 'pt-BR');
  },

  // 3. MUDAR CONFIG DE VOZ
  mudarVoz(modo, genero) {
    this.configVoz.modo = modo;
    this.configVoz.genero = genero;
    this.carregarVozes();
    this.adicionarNaTela("kai", `Voz alterada para ${genero}. Modo ${modo}.`);
  },

  // 4. CÉREBRO PRINCIPAL - ROTEADOR DE GAVETAS
  async processar(textoOriginal) {
    const texto = textoOriginal.toLowerCase().trim();
    this.adicionarNaTela("user", textoOriginal);
    this.memoria.contexto.push({role: "user", content: textoOriginal});
    let resposta = "";

    // COMANDOS GLOBAIS DE VOZ
    if (texto.includes("mudar voz")) { 
      this.mudarVoz(this.configVoz.modo, texto.includes("feminino")?"feminino":"masculino"); 
      return; 
    }
    if (texto.includes("modo ilimitado")) { this.mudarVoz("ilimitada", this.configVoz.genero); return; }
    if (texto.includes("modo limitado")) { this.mudarVoz("limitada", this.configVoz.genero); return; }
    if (texto.includes("calar") || texto.includes("silencio")) { speechSynthesis.cancel(); return; }

    // ROTEADOR: DECIDE QUAL GAVETA ABRIR
    try {
      if (texto.includes("vai") || texto.includes("abre") || texto.includes("ir para") || texto.includes("voltar") || texto.includes("fechar")) {
        resposta = Navega.ir(texto);
      }
      else if (texto.includes("cria") || texto.includes("faça") || texto.includes("gere") || texto.includes("post") || texto.includes("roteiro") || texto.includes("imagem")) {
        resposta = await Cria.executar(texto);
      }
      else if (texto.includes("copia") || texto.includes("resuma") || texto.includes("analisa") || texto.includes("traduz") || texto.includes("explique")) {
        resposta = await Copia.executar(texto);
      }
      else if (texto.includes("lembrar") || texto.includes("salvar") || texto.includes("hora") || texto.includes("data") || texto.includes("config") || texto.includes("limpar")) {
        resposta = await Sistema.executar(texto);
      }
      else if (texto.includes("oi") || texto.includes("ola") || texto.includes("e aí")) {
        resposta = `Olá ${this.memoria.nomeUsuario}! K-AI Jarvis na área. Em que posso ajudar?`;
      }
      else {
        // SE NÃO FOR NENHUM COMANDO, USA IA ILIMITADA
        if(this.configVoz.modo === "ilimitada"){
          resposta = await this.conversarComIA(textoOriginal);
        } else {
          resposta = "Não entendi o comando. Tente: Criar, Navegar, Analisar ou Salvar.";
        }
      }
    } catch(e) {
      console.error(e);
      resposta = "Ocorreu um erro ao executar. Tente novamente.";
    }

    this.memoria.contexto.push({role: "assistant", content: resposta});
    this.adicionarNaTela("kai", resposta);
    this.falar(resposta);
  },

  // 5. CONVERSA ILIMITADA COM IA - PRONTO PRA API
  async conversarComIA(prompt) {
    // AQUI ENTRA SUA API KEY DO GEMINI OU GPT
    // const response = await fetch('https://api.google.com/...', {method: 'POST', body: JSON.stringify({prompt})})
    
    // SIMULAÇÃO POR ENQUANTO
    return `Modo Ilimitado: Entendi sobre "${prompt}". Quer que eu aprofunde nisso e crie um plano de ação pra você?`;
  },

  // 6. FALAR
  falar(texto) {
    if ('speechSynthesis' in window && this.configVoz.modo !== "mudo") {
      speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = 'pt-BR'; 
      fala.voice = this.configVoz.vozSelecionada;
      fala.rate = this.configVoz.velocidade;
      fala.pitch = this.configVoz.genero === "masculino" ? 0.8 : 1.2; 
      fala.volume = 1;
      fala.onstart = () => { if(window.pulsarCore) pulsarCore(); }
      speechSynthesis.speak(fala);
    }
  },

  // 7. ADICIONAR NA TELA
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

// INICIA QUANDO CARREGA
window.onload = () => KAI.iniciar();

// FUNÇÃO DO BOTÃO ENVIAR E ENTER
function enviarMensagem() {
  const input = document.getElementById('userInput');
  const texto = input.value;
  if (!texto) return;
  input.value = "";
  KAI.processar(texto);
}
