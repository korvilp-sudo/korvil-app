class DetectorGestos {
  constructor(){
    this.ultimoGesto = "";
    this.cooldown = 0;
  }

  dist(a,b){return Math.hypot(a.x-b.x, a.y-b.y);}

  detectarMao(l){
    const d = {
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
