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
    if(d.i && d.m && d.a &&!d.mi) return "TRES";
    if(d.i && d.m && d.a && d.mi) return "QUATRO";
    if(d.polegar) return "LIKE";
    if(!d.polegar && l[4].y > l[3].y) return "DISLIKE";
    return "NEUTRO";
  }

  detectarDuasMaos(m1,m2,p1,p2){
    const g1 = this.detectarMao(m1);
    const g2 = this.detectarMao(m2);
    const dist = Math.hypot(p1.x-p2.x, p1.y-p2.y);

    if(g1=="CLIQUE" && g2=="CLIQUE") return dist > 200? "ZOOM_IN" : "ZOOM_OUT";
    if(g1=="ABRIR" && g2=="ABRIR" && dist < 120) return "EXPLODIR";
    if(g1=="PAZ" && g2=="PAZ") return "FOTO";
    if(g1=="PUNHO" && g2=="PUNHO") return "MENU";
    if(g1=="LIKE" && g2=="LIKE") return "JARVIS";
    if(g1=="APONTAR" && g2=="APONTAR") return "MIRA";

    return g1+"_"+g2;
  }

  executar(gesto, cubo){
    if(gesto==this.ultimoGesto || this.cooldown>0) return;
    this.ultimoGesto = gesto;
    this.cooldown = 10;
    setInterval(()=>{if(this.cooldown>0)this.cooldown--}, 100);

    document.getElementById('status').innerText = `COMANDO: ${gesto}`;
    this.falar(gesto);

    // AÇÕES
    const acoes = {
      "CLIQUE": ()=>{cubo.style.borderColor='#ff00ff'; setTimeout(()=>cubo.style.borderColor='#00f5ff',300)},
      "ABRIR": ()=>{window.setTargetEscala(1.8)},
      "PUNHO": ()=>{window.setTargetEscala(0.6)},
      "APONTAR": ()=>{cubo.style.boxShadow='0 0 100px #00f5ff'},
      "PAZ": ()=>{alert("✌️ MODO PAZ ATIVADO")},
      "LIKE": ()=>{cubo.style.transform += " rotateZ(360deg)"},
      "ZOOM_IN": ()=>{window.setTargetEscala(2.5)},
      "ZOOM_OUT": ()=>{window.setTargetEscala(0.5)},
      "EXPLODIR": ()=>{window.explodirCubo()},
      "FOTO": ()=>{alert("📸 FOTO CAPTURADA")},
      "MENU": ()=>{alert("⚙️ MENU KORVIL")},
      "JARVIS": ()=>{this.falar("A disposição senhor")},
      "MIRA": ()=>{cubo.style.borderColor='#ff0000'}
    };
    if(acoes[gesto]) acoes[gesto]();
  }

  falar(txt){
    const mapa = {
      "CLIQUE":"Clicando", "ABRIR":"Abrindo", "PUNHO":"Fechando", "EXPLODIR":"Explosão",
      "FOTO":"Tirando foto", "MENU":"Abrindo menu", "JARVIS":"Sim senhor"
    };
    const s = new SpeechSynthesisUtterance(mapa[txt] || txt);
    s.lang='pt-BR'; s.rate=1.1; s.pitch=1.2;
    speechSynthesis.speak(s);
  }
}
