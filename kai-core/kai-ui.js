const KAI_UI = {
  scene: null,
  camera: null,
  renderer: null,
  nucleo: null,
  ring1: null,
  ring2: null,
  recognition: null,
  chat: null,

  init() {
    this.chat = document.getElementById('chat');
    this.iniciarCena3D();
    this.iniciarReconhecimento();
    this.eventos();
    this.falar(`K-AI online. Modo Chefe ativo. Pronto para comandos.`);
  },

  // ===== 1. CENA 3D CORVO =====
  iniciarCena3D() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({canvas:document.getElementById('canvas3d'), antialias:true, alpha:true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.nucleo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 2),
      new THREE.MeshPhongMaterial({color:0x00f5ff, emissive:0x00f5ff, emissiveIntensity:0.7, transparent:true, opacity:0.9})
    );
    this.scene.add(this.nucleo);

    this.ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 16, 100),
      new THREE.MeshBasicMaterial({color:0x00f5ff, wireframe:true})
    );
    this.ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 16, 100),
      new THREE.MeshBasicMaterial({color:0x00f5ff, wireframe:true})
    );
    this.ring2.rotation.x = Math.PI/2;

    this.scene.add(this.ring1, this.ring2);

    const light = new THREE.PointLight(0x00f5ff, 2, 50);
    light.position.set(5,5,5);
    this.scene.add(light);

    this.camera.position.z = 5;
    this.animate();
  },

  animate() {
    requestAnimationFrame(()=>this.animate());
    if(this.nucleo){
      this.nucleo.rotation.x += 0.01;
      this.nucleo.rotation.y += 0.018;
      this.ring1.rotation.y += 0.025;
      this.ring2.rotation.z += 0.018;
      this.renderer.render(this.scene, this.camera);
    }
  },

  pulsarCore() {
    if(KAI_UI.nucleo){
      KAI_UI.nucleo.material.emissiveIntensity = 1.5;
      setTimeout(()=>{ if(KAI_UI.nucleo) KAI_UI.nucleo.material.emissiveIntensity=0.7 },250)
    }
  },

  // ===== 2. CHAT UI =====
  addMsg(tipo, texto){
    const div = document.createElement('div');
    div.className = 'msg ' + tipo;
    div.innerHTML = tipo==='user'? `<b>Você:</b> ${texto}` : `<b>K-AI:</b> ${texto}`;
    this.chat.appendChild(div);
    this.chat.scrollTop = this.chat.scrollHeight;
  },

  // ===== 3. VOZ TEMPO REAL =====
  iniciarReconhecimento(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) {
      console.log("Reconhecimento de voz não suportado");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = (e)=>{
      const cmd = e.results[e.results.length-1][0].transcript;
      if(cmd.length > 2){
        this.addMsg('user',cmd);
        KAI_BRAIN.processarComando(cmd);
      }
    }

    this.recognition.onerror = (e)=>{ console.log("Erro voz:", e.error) }

    this.recognition.onend = ()=>{
      if(KAI_CONFIG.autoOuvir) this.recognition.start();
    }

    try{ this.recognition.start(); }catch(e){}
  },

  toggleMic(){
    KAI_CONFIG.autoOuvir =!KAI_CONFIG.autoOuvir;
    document.getElementById('autoListen').style.display = KAI_CONFIG.autoOuvir? 'block':'none';
    document.getElementById('micBtn').classList.toggle('listening', KAI_CONFIG.autoOuvir);

    if(!KAI_CONFIG.autoOuvir && this.recognition) this.recognition.stop();
    else if(KAI_CONFIG.autoOuvir && this.recognition) this.recognition.start();
  },

  falar(texto){
    this.addMsg('kai', texto);
    speechSynthesis.cancel(); // Para fala anterior
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR';
    utter.pitch = 0.6; // VOZ CORVO GRAVE
    utter.rate = 0.95;
    utter.volume = 1;
    utter.onstart = this.pulsarCore;
    speechSynthesis.speak(utter);
  },

  // ===== 4. INPUT E MENU =====
  enviarTexto(){
    const input = document.getElementById('userInput');
    if(!input.value.trim()) return;
    this.addMsg('user', input.value);
    KAI_BRAIN.processarComando(input.value);
    input.value = "";
  },

  executar(cmd){
    this.toggleMenu();
    this.addMsg('user', cmd);
    KAI_BRAIN.processarComando(cmd);
  },

  toggleMenu(){
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display==='block'?'none':'block';
  },

  // ===== 5. ANEXO DE ARQUIVO =====
  anexarArquivo(){
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*,.pdf,.txt,.doc,.docx";
    input.onchange = async (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      this.addMsg('user', `📎 Arquivo: ${file.name}`);
      const res = await Copia.lerArquivo(file);
      this.falar(res);
    }
    input.click();
  },

  // ===== 6. EVENTOS GERAIS =====
  eventos(){
    window.addEventListener('resize', ()=>{
      if(this.camera && this.renderer){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    document.getElementById('userInput').addEventListener('keydown', (e)=>{
      if(e.key==='Enter') this.enviarTexto();
    });
  }
}

// ===== CÉREBRO SEPARADO - 9 GAVETAS =====
const KAI_BRAIN = {
  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    let resposta = "";

    // ATALHOS SISTEMA
    if(cmd.includes("parar de ouvir")) {
      KAI_CONFIG.autoOuvir=false;
      if(KAI_UI.recognition) KAI_UI.recognition.stop();
      resposta="Modo manual ativado Chefe";
    }
    else if(cmd.includes("voltar a ouvir")) {
      KAI_CONFIG.autoOuvir=true;
      if(KAI_UI.recognition) KAI_UI.recognition.start();
      resposta="Voltando a ouvir";
    }

    // CHAMADAS DAS GAVETAS - ORDEM DE PRIORIDADE
    else if (cmd.includes("vai") || cmd.includes("abrir")) {
      resposta = Navega.ir(cmd);
    }
    else if (cmd.includes("cria")) {
      resposta = await Cria.executar(cmd);
    }
    else if (cmd.includes("copia") || cmd.includes("resuma") || cmd.includes("analisa") || cmd.includes("traduz")) {
      resposta = await Copia.executar(cmd);
    }
    else if (cmd.includes("hora") || cmd.includes("salvar") || cmd.includes("memória") || cmd.includes("data") || cmd.includes("status")) {
      resposta = await Sistema.executar(cmd);
    }
    // 5 NOVAS GAVETAS
    else if (cmd.includes("buscar") || cmd.includes("pesquisar")) {
      resposta = await Busca.executar(cmd);
    }
    else if (cmd.includes("calcular") || cmd.includes("somar") || cmd.includes("dividir") || cmd.includes("multiplicar") || cmd.includes("%")) {
      resposta = await Calculo.executar(cmd);
    }
    else if (cmd.includes("postar") || cmd.includes("instagram") || cmd.includes("social") || cmd.includes("story") || cmd.includes("reels")) {
      resposta = await Social.executar(cmd);
    }
    else if (cmd.includes("lead") || cmd.includes("venda") || cmd.includes("proposta") || cmd.includes("crm") || cmd.includes("cliente")) {
      resposta = await Vendas.executar(cmd);
    }
    else if (cmd.includes("aula") || cmd.includes("curso") || cmd.includes("aprender") || cmd.includes("exercício") || cmd.includes("estudar")) {
      resposta = await Educacao.executar(cmd);
    }
    // FALLBACK
    else {
      resposta = `Comando recebido: "${cmdOriginal}". Tente: criar post, copiar tudo, pesquisar algo, calcular 10%`;
    }

    KAI_UI.falar(resposta);
  }
}
