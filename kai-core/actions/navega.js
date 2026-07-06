const Navega = {
  // ARMADURA ATUAL - MUDA AQUI TODO ANO: v-2027, v-2028
  armaduraAtual: "v-2026",

  // ROTAS QUE JÁ EXISTEM NO SEU APP.HTML
  rotasInternas: {
    "central": "central",
    "sistema k": "sistema",
    "k-tp": "ktp-iframe",
    "k-afortunado": "kafortunado",
    "k-alma": "kalma",
    "humano": "humano",
    "desenvolvimento humano": "humano",
    "negocios": "negocios",
    "servicos": "servicos",
    "inicio": "central",
    "home": "central",
    "menu": "central",
    "voltar": "central"
  },

  ir(comando) {
    let pagina = comando.replace("vai para", "").replace("abrir", "").replace("ir para", "").replace("acessar", "").trim().toLowerCase();

    // ===== COMANDO 1: K-AI TRANSFORMAR =====
    if(pagina.includes("k-ai transformar") || pagina === "transformar"){
      this.iniciarTransformacao(this.armaduraAtual);
      if(window.parent && window.parent.falar) window.parent.falar(`Protocolo SAY KORVIL ativado. Montando Armadura ${this.armaduraAtual}... 15 segundos.`);
      return `Protocolo SAY KORVIL ativado. Montando Armadura ${this.armaduraAtual}... 15 segundos.`;
    }

    // ===== COMANDO 2: K-AI MOSTRAR ARMADURA =====
    if(pagina.includes("k-ai mostrar armadura") || pagina.includes("mostrar armadura")){
      this.mostrarArmadura(this.armaduraAtual);
      if(window.parent && window.parent.falar) window.parent.falar(`Exibindo Armadura ${this.armaduraAtual}. Protocolo ativo.`);
      return `Exibindo Armadura ${this.armaduraAtual}. Protocolo ativo.`;
    }

    // ATALHOS POR NUMERO
    if(pagina.includes("1") || pagina.includes("sistema")) pagina = "sistema k";
    if(pagina.includes("2") || pagina.includes("tp")) pagina = "k-tp";
    if(pagina.includes("3") || pagina.includes("afortunado")) pagina = "k-afortunado";
    if(pagina.includes("4") || pagina.includes("alma")) pagina = "k-alma";
    if(pagina.includes("5") || pagina.includes("central")) pagina = "central";
    if(pagina.includes("6") || pagina.includes("humano")) pagina = "humano";
    if(pagina.includes("7") || pagina.includes("negocio")) pagina = "negocios";
    if(pagina.includes("8") || pagina.includes("servico")) pagina = "servicos";

    // PROCURA NAS ROTAS INTERNAS
    for(let chave in this.rotasInternas){
      if(pagina.includes(chave)){
        const idTela = this.rotasInternas[chave];

        // CASO ESPECIAL K-TP QUE USA IFRAME
        if(idTela === "ktp-iframe"){
          window.parent.irParaKTP(); // chama a função que já existe no app
        } else {
          window.parent.abrirTela(idTela); // chama a função que já existe no app
        }

        if(window.parent && window.parent.falar) window.parent.falar(`Abrindo ${chave.toUpperCase()}.`);
        return `Abrindo ${chave.toUpperCase()}.`;
      }
    }

    return `Página "${pagina}" não encontrada. Diga: central, sistema k, k-tp, k-afortunado, k-alma, humano, negocios ou servicos. Ou diga: K-AI transformar / K-AI mostrar armadura`;
  },

  // ===== FUNÇÃO 1: TRANSIÇÃO 15S =====
  iniciarTransformacao(versao){
    // Remove se já existir
    const antigo = document.getElementById("transicaoFrame");
    if(antigo) document.body.removeChild(antigo);

    // Chama o iframe da transição
    const transicaoFrame = document.createElement('iframe');
    transicaoFrame.id = "transicaoFrame";
    transicaoFrame.src = `kai-transformar/transiction-transform.html?armadura=${versao}`;
    transicaoFrame.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:999;background:#000;border:0;";
    document.body.appendChild(transicaoFrame);

    // Depois de 15s fecha a transição e abre a armadura
    setTimeout(()=>{
      const frame = document.getElementById("transicaoFrame");
      if(frame) document.body.removeChild(frame);
      this.mostrarArmadura(versao);
    }, 15000);
  },

  // ===== FUNÇÃO 2: MOSTRAR ARMADURA =====
  mostrarArmadura(versao){
    // Remove se já existir
    const antigo = document.getElementById("armaduraFrame");
    if(antigo) document.body.removeChild(antigo);
    const btnAntigo = document.getElementById("btnFecharArmadura");
    if(btnAntigo) document.body.removeChild(btnAntigo);

    // Chama o iframe da armadura
    const armaduraFrame = document.createElement('iframe');
    armaduraFrame.id = "armaduraFrame";
    armaduraFrame.src = `kai-transformar/armaduras/${versao}.html`;
    armaduraFrame.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:998;background:transparent;border:0;pointer-events:auto;";
    document.body.appendChild(armaduraFrame);

    // Botão de fechar
    const btnFechar = document.createElement('button');
    btnFechar.id = "btnFecharArmadura";
    btnFechar.innerText = "FECHAR ARMADURA";
    btnFechar.style.cssText = "position:fixed;top:80px;right:20px;z-index:1000;background:#000;border:2px solid #00FFFF;color:#00FFFF;padding:10px 20px;border-radius:20px;font-weight:900;cursor:pointer;box-shadow:0 0 15px #00FFFF;font-family:'Segoe UI',Arial;";
    btnFechar.onclick = () => {
      const frame = document.getElementById("armaduraFrame");
      const btn = document.getElementById("btnFecharArmadura");
      if(frame) document.body.removeChild(frame);
      if(btn) document.body.removeChild(btn);
      if(window.parent && window.parent.falar) window.parent.falar("Armadura desativada.");
    };
    document.body.appendChild(btnFechar);
  },

  // FUNÇÃO PRA MUDAR A ARMADURA DO ANO
  setArmadura(versao){
    this.armaduraAtual = versao;
    console.log(`Armadura atualizada para: ${versao}`);
    if(window.parent && window.parent.falar) window.parent.falar(`Armadura atualizada para ${versao}`);
  },

  // FUNÇÃO PRA PEGAR A ARMADURA ATUAL
  getArmadura(){
    return this.armaduraAtual;
  }
}
