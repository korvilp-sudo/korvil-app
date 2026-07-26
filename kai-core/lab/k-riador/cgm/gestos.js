class DetectorGestos {
  constructor(){
    this.ultimoGesto = "";
    this.cooldown = 0;
  }

  dist(a,b){return Math.hypot(a.x-b.x, a.y-b.y);}

  detectarMao(l){
    const d = {class DetectorGestos {
  constructor() {
    this.ultimoGesto = "";
    this.cooldown = 0;
    this.timerPunho = null;
    this.segurandoObjeto = false;
  }

  dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  checkFingerExtended(l, tipIdx, knuIdx) {
    return l[tipIdx].y < l[knuIdx].y;
  }

  detectarMao(l) {
    // 1. Pinch Detection (CLIQUE) against thumb and ANY fingertip
    const thumbTip = l[4];
    const fingerTips = [8, 12, 16, 20];
    const pinches = fingerTips.map(tip => this.dist(thumbTip, l[tip]));
    const isPinching = pinches.some(d => d < 0.05);
    if (isPinching) return "CLIQUE";

    // Simplified finger state based on y-coordinate relative to knuckles
    const isExt = fingerTips.map((tip, i) => this.checkFingerExtended(l, tip, [5, 9, 13, 17][i]));
    const allExt = isExt.every(e => e);
    const allCurls = isExt.every(e => !e);

    if (allExt) return "ABRIR";
    if (allCurls) return "PUNHO";
    if (isExt[0] && isExt[1]) return "PAZ";
    if (isExt[0]) return "APONTAR";
    if (this.dist(l[4], l[2]) > 0.1 && allCurls) return "LIKE"; // simplistic Like
    return "NEUTRO";
  }

  detectarDuasMaos(m1, m2, p1, p2) {
    const g1 = this.detectarMao(m1);
    const g2 = this.detectarMao(m2);

    const combos = {
      "APONTAR_ABRIR": "NOVO_CUBO",
      "ABRIR_ABRIR": "DELETAR_TUDO",
      "ABRIR_LIKE": "ABRIR_MENU",
      "APONTAR_APONTAR": "MODO_MIRA",
      "PUNHO_PUNHO": "MODO_ENERGIA",
      "LIKE_LIKE": "SUPER_CONFIRMACAO",
      "PAZ_PAZ": "PARAR_SIMULACAO",
      "NEUTRO_NEUTRO": "RESETAR",
      "PUNHO_LIKE": "MODO_CONFIG",
      "PUNHO_APONTAR": "MODO_SAIR",
      "ABRIR_PAZ": "MODO_DEBUG",
      "APONTAR_LIKE": "MODO_ALTERNAR",
    };

    return combos[g1 + "_" + g2] || (combos[g2 + "_" + g1] ? combos[g2 + "_" + g1] : g1 + "_" + g2);
  }

  executar(gesto, ctx) {
    if (gesto === this.ultimoGesto || this.cooldown > 0) return;
    this.ultimoGesto = gesto;
    this.cooldown = 15;
    setInterval(() => {
      if (this.cooldown > 0) this.cooldown--
    }, 100);

    const tutMenu = document.getElementById('tutorialMenu');

    if (gesto === "NEUTRO") {
      tutMenu.innerText = `STATUS: ${gesto}. PINCE COM DEDÃO/QUAISQUER PRA SEGURAR (hold). OU PUNHO (2s hold).`;
      return;
    }

    tutMenu.innerText = `STATUS: ${gesto}`;
    this.falar(gesto);

    // Held-Punhão State Logic: Punsão for hold/release, PUNHO (2s hold)
    if (gesto === "PUNHO") {
      if (!this.timerPunho) {
        this.timerPunho = setTimeout(() => {
          if (this.ultimoGesto === "PUNHO") {
            this.segurandoObjeto = true;
            this.cooldown = 50; // allow release cooldown after automatic hold
            ctx.iniciarSegurada('punsão');
            this.falar("Segurando objeto");
          }
        }, 2000);
      }
    } else {
      if (this.timerPunho) {
        clearTimeout(this.timerPunho);
        this.timerPunho = null;
      }
      if (gesto === "ABRIR" && this.segurandoObjeto) {
        this.segurandoObjeto = false;
        ctx.soltarObjeto();
        this.falar("Objeto solto");
      }
    }

    // Pinch punsão holds are not timed, managed entirely in index.html (ctx)
    if (gesto === "CLIQUE" && !this.segurandoObjeto) {
      this.timerCLIQUEHold = setTimeout(() => {
        if (this.ultimoGesto === "CLIQUE") {
          ctx.iniciarSegurada('clique');
          this.segurandoObjeto = true;
          this.falar("Segurando objeto");
        }
      }, 50); // small delay to distinguish tap from hold, release is handled in ctx
    }
    // and release is handled implicitly when gesture is no longer punsão

    const acoes = {
      // Single confirm actions
      "LIKE": () => ctx.confirmarAcao(),
      "NEUTRO": () => {},
      // Two-hand actions
      "NOVO_CUBO": () => ctx.criarCubo(),
      "DELETAR_TUDO": () => {
        ctx.cubos.forEach(c => ctx.deletarCubo(c))
      },
      "ABRIR_MENU": () => {
        ctx.menu.style.boxShadow = '0 0 50px #ff00ff'
      },
      "MODO_MIRA": () => ctx.toggleMiraMode(),
      "MODO_ENERGIA": () => ctx.togglePowerMode(),
      "SUPER_CONFIRMACAO": () => ctx.confirmarTudo(),
      "PARAR_SIMULACAO": () => ctx.pausarSimulacao(),
      "RESETAR": () => ctx.resetView(),
      "MODO_CONFIG": () => ctx.abrirConfig(),
      "MODO_SAIR": () => ctx.sairConfig(),
      "MODO_DEBUG": () => ctx.modoDebug(),
      "MODO_ALTERNAR": () => ctx.mudarEfeito()
    };

    if (acoes[gesto]) acoes[gesto]();
  }

  falar(txt) {
    const mapa = {
      "NOVO_CUBO": "Criando cubo",
      "DELETAR_TUDO": "Apagar tudo",
      "ABRIR_MENU": "Menu aberto",
      "MODO_MIRA": "Modo de mira ativado",
      "MODO_ENERGIA": "Modo de energia ativado",
      "SUPER_CONFIRMACAO": "Ação confirmada",
      "PARAR_SIMULACAO": "Simulação pausada",
      "RESETAR": "Visão resetada",
      "MODO_CONFIG": "Configurações abertas",
      "MODO_SAIR": "Sair das configurações",
      "MODO_DEBUG": "Modo de debug ativado",
      "MODO_ALTERNAR": "Mudando efeito",
      "PUNHO": "Fechar punsão",
      "ABRIR": "Mão aberta",
      "NEUTRO": ""
    };

    const s = new SpeechSynthesisUtterance(mapa[txt] || txt);
    s.lang = 'pt-BR';
    s.rate = 1.1;
    speechSynthesis.speak(s);
  }
}
      pinca: this.dist(l[4], l[8]),
      mao: this.dist(l[5], l[17]),
      i: l[8].y < l[6].y,
      m: l[12].y < l[10].y,
      a: l[16].y < l[14].y,
      mi: l[20].y < l[18].y,
      polegar: l[4].y < l[3].y
    };
    if(d.pinca < 0.04) return "CLIQUE";
    if(d.mao > 0.22) return "ABRIR";
    if(!d.i &&!d.m &&!d.a &&!d.mi) return "PUNHO";
    if(d.i &&!d.m &&!d.a &&!d.mi) return "APONTAR";
    if(d.i && d.m &&!d.a &&!d.mi) return "PAZ";
    if(d.polegar) return "LIKE";
    return "NEUTRO";
  }

  detectarDuasMaos(m1,m2,p1,p2){
    const g1 = this.detectarMao(m1);
    const g2 = this.detectarMao(m2);
    const dist = Math.hypot(p1.x-p2.x, p1.y-p2.y);

    if(g1=="CLIQUE" && g2=="CLIQUE") return "NOVO_CUBO";
    if(g1=="PAZ" && g2=="PAZ") return "DELETAR_TUDO";
    if(g1=="PAZ" && g2=="LIKE") return "ABRIR_MENU";
    if(g1=="APONTAR" && g2=="APONTAR") return "MODO_MIRA";

    return g1+"_"+g2;
  }

  executar(gesto, ctx){
    if(gesto==this.ultimoGesto || this.cooldown>0) return;
    this.ultimoGesto = gesto;
    this.cooldown = 15;
    setInterval(()=>{if(this.cooldown>0)this.cooldown--}, 100);

    document.getElementById('statusMenu').innerText = `STATUS: ${gesto}`;
    this.falar(gesto);

    const acoes = {
      "NOVO_CUBO": ()=>ctx.criarCubo(),
      "DELETAR_TUDO": ()=>{ctx.cubos.forEach(c=>ctx.deletarCubo(c))},
      "ABRIR_MENU": ()=>{ctx.menu.style.boxShadow='0 0 50px #ff00ff'},
      "CLIQUE": ()=>{},
      "ABRIR": ()=>{}
    };
    if(acoes[gesto]) acoes[gesto]();
  }

  falar(txt){
    const mapa = {
      "NOVO_CUBO":"Novo cubo", "DELETAR_TUDO":"Limpando tudo",
      "ABRIR_MENU":"Menu aberto", "CLIQUE":"Segurando"
    };
    const s = new SpeechSynthesisUtterance(mapa[txt] || txt);
    s.lang='pt-BR'; s.rate=1.1;
    speechSynthesis.speak(s);
  }
}
