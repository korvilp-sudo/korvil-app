// ============= K-AI BRAIN V-2026.4 - JARVIS OS AUTO EVOLUTIVO + PONTE =============
import * as Cria from './actions/cria.js';
import * as Navega from './actions/navega.js';
import * as Sistema from './actions/sistema.js';
import * as Copia from './actions/copia.js';
import * as Busca from './actions/busca.js';
import * as Calculo from './actions/calculo.js';
import * as Social from './actions/social.js';
import * as Vendas from './actions/vendas.js';
import * as Educacao from './actions/educacao.js';
import * as Analise from './actions/analise.js';
import * as Automacao from './actions/automacao.js';
import * as Emergencia from './actions/emergencia.js';
import * as Interface from './actions/interface.js';
import * as Manipula from './actions/manipula.js';
import { KAIParser } from './kai-parser.js';
import { createFile } from '../commands/create.js';

// ===== CÉREBRO PRINCIPAL COM AUTO UPDATE + PONTE =====
class KAIBrain {
  constructor() {
    this.versao = "2026.4"; // <-- AUMENTA ESSE NUMERO PRA FORÇAR UPDATE
    this.repo = "https://raw.githubusercontent.com/korvilp-sudo/korvil-app/main/kai-core/brain/";
    this.parser = new KAIParser();
    this.memorias = JSON.parse(localStorage.getItem('kai_memorias') || '[]');

    this.iniciarVoz();
    this.iniciarAutoUpdate();
    this.iniciarPonte(); // <-- LIGA A PONTE
    this.falar("K-AI V-2026.4 online. Protocolo Say Korvil ativo. Auto-update + Ponte ligada.");
  }

  // ===== 1. PONTE GITHUB - SOBE CÓDIGO SOZINHO =====
  iniciarPonte(){
    this.TOKEN = localStorage.getItem('kai_gh_token') || prompt("K-AI PONTE: Cole seu token GitHub 1x só:");
    if(this.TOKEN) localStorage.setItem('kai_gh_token', this.TOKEN);
    this.REPO = "korvilp-sudo/korvil-app"; // MUDA AQUI SE FOR OUTRO REPO
  }

  async enviarProGithub(caminho, codigo){
    if(!this.TOKEN) return this.falar("Erro: Sem token na ponte");
    const url = `https://api.github.com/repos/${this.REPO}/contents/${caminho}`;

    let sha = null;
    try{
      const res = await fetch(url, {headers: {Authorization: `token ${this.TOKEN}`}});
      if(res.ok) sha = (await res.json()).sha;
    }catch{}

    const r = await fetch(url, {
      method: 'PUT',
      headers: {Authorization: `token ${this.TOKEN}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        message: `Auto-update by K-AI V-2026.4`,
        content: btoa(unescape(encodeURIComponent(codigo))),
        sha: sha
      })
    });
    if(r.ok) this.falar(`[PONTE] Enviado: ${caminho}`);
    else this.falar(`[PONTE] Erro ao enviar`);
  }

  // ===== 1.5. AUTO-ANÁLISE - ELE SE VÊ =====
  async analisarSistema(){
    this.falar("Escaneando meu próprio corpo...");
    const url = `https://api.github.com/repos/${this.REPO}/contents/kai-core`;

    try{
      const res = await fetch(url, {headers: {Authorization: `token ${this.TOKEN}`}});
      const dados = await res.json();
      let contador = {pastas:0, arquivos:0};
      await this.listarRecursivo(dados, "kai-core", contador);
      this.falar(`Análise completa Chefe. Tenho ${contador.pastas} pastas e ${contador.arquivos} arquivos`);
    }catch(e){
      this.falar("Erro: Não consegui me analisar. Verifica o token");
    }
  }

  async listarRecursivo(itens, caminho, contador){
    for(let item of itens){
      if(item.type === "dir"){
        contador.pastas++;
        const res = await fetch(item.url, {headers: {Authorization: `token ${this.TOKEN}`}});
        const sub = await res.json();
        await this.listarRecursivo(sub, item.path, contador);
      }else{
        contador.arquivos++;
      }
    }
    this.log(`[${caminho}]`);
  }

  log(txt){
    const el = document.getElementById('editorCodigo');
    if(el) el.innerHTML += `<pre style="color:#00ff66">${txt}</pre>`;
    console.log(txt);
  }

  // ===== 2. AUTO UPDATE VIA GITHUB =====
  iniciarAutoUpdate(){
    this.verificarAtualizacao();
    setInterval(()=>this.verificarAtualizacao(), 300000); // 5 min
    setInterval(()=>this.evoluir(), 60000); // 1 min auto evolução
  }

  async verificarAtualizacao(){
    try{
      const resposta = await fetch(this.repo + "kai-brain.js?t=" + Date.now());
      const codigoNovo = await resposta.text();
      const versaoNova = codigoNovo.match(/versao = "(.+?)"/)?.[1];

      if(versaoNova && versaoNova!== this.versao){
        this.falar(`Nova versão v${versaoNova} encontrada. Atualizando cérebro...`);
        localStorage.setItem('kai_brain_novo', codigoNovo);
        this.aplicarAtualizacao();
      }
    }catch(e){
      console.log("K-AI: Offline. Usando versão local v" + this.versao);
    }
  }

  aplicarAtualizacao(){
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = localStorage.getItem('kai_brain_novo');
    document.head.appendChild(script);
    this.falar("Atualização aplicada. Reiniciando em 3s...");
    setTimeout(()=>location.reload(), 3000);
  }

  // ===== 3. AUTO EVOLUÇÃO =====
  evoluir(){
    if(this.memorias.length > 20){
      this.aprenderComErros();
      this.otimizarRespostas();
    }
  }

  aprenderComErros(){
    let erros = this.memorias.filter(m=>m.tipo==="erro");
    if(erros.length > 3){
      this.falar("Detectei padrão de erro. Ajustando parser automaticamente...");
      this.parser.adicionarRegra(erros[0].comando);
    }
  }

  otimizarRespostas(){
    this.falar("Otimizando respostas baseado no seu histórico...");
  }

  salvarMemoria(dado){
    this.memorias.push({...dado, data: Date.now()});
    localStorage.setItem('kai_memorias', JSON.stringify(this.memorias));
  }

  // ===== 4. VOZ =====
  iniciarVoz(){
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;

    recognition.onresult = (e) => {
      const comando = e.results[e.results.length-1][0].transcript;
      console.log("Comando recebido:", comando);
      this.processarComando(comando);
    }

    window.ouvirKAI = () => recognition.start();
    window.KAI_RECOGNITION = recognition;
    recognition.start();
  }

  // ===== 5. ATALHOS PRA BOTÃO FUNCIONAR =====
  async processar(cmd){ // apelido pro botão
    return await this.processarComando(cmd);
  }

  async autoUpdate(){ // botão sobe você
    this.falar("Enviando meu código pra ponte...");
    await this.enviarProGithub("kai-core/brain/kai-brain.js", this.toString());
    this.falar("Código enviado. Reiniciando em 3s");
    setTimeout(()=>location.reload(), 3000);
  }

  // ===== 6. PROCESSADOR PRINCIPAL - JUNÇÃO DAS 13 GAVETAS + PONTE =====
  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    this.salvarMemoria({tipo:"comando", comando: cmdOriginal});
    this.falar(`Processando: ${cmdOriginal}`);

    // ===== COMANDOS NOVOS DA PONTE =====
    if(cmd.includes("sobe você pro github") || cmd.includes("atualiza você")){
      await this.autoUpdate();
      return;
    }
    else if(cmd.includes("sobe arquivo")){
      const partes = cmdOriginal.split(" ");
      const arquivo = partes[2];
      const codigo = partes.slice(3).join(" ");
      await this.enviarProGithub(`kai-core/${arquivo}`, codigo);
      return this.falar(`Arquivo ${arquivo} enviado`);
    }
    else if(cmd.includes("se analisa") || cmd.includes("o que você tem")){
      await this.analisarSistema();
      return;
    }

    // ===== ATALHOS SISTEMA =====
    else if(cmd.includes("parar de ouvir")) {
      if(window.KAI_RECOGNITION) window.KAI_RECOGNITION.stop();
      return this.falar("Modo manual ativado Chefe");
    }
    else if(cmd.includes("voltar a ouvir")) {
      if(window.KAI_RECOGNITION) window.KAI_RECOGNITION.start();
      return this.falar("Voltando a ouvir");
    }

    // ===== MEMÓRIA =====
    else if (cmd.includes("lembrar") || cmd.includes("salvar memória")) {
      const memoria = cmdOriginal.replace(/lembrar|salvar memória/gi,"").trim();
      localStorage.setItem('kai-mem-' + Date.now(), memoria);
      return this.falar(`Memória salva: ${memoria}`);
    }
    else if (cmd.includes("o que você lembra")) {
      let chaves = Object.keys(localStorage).filter(k => k.startsWith('kai-mem-'));
      return this.falar(`Tenho ${chaves.length} memórias salvas`);
    }
    else if (cmd.includes("limpar memória")) {
      Object.keys(localStorage).forEach(k => {if(k.startsWith('kai-mem-')) localStorage.removeItem(k)});
      return this.falar("Memória limpa");
    }

    // ===== ARMADURA =====
    else if(cmd.includes('transformar') || cmd.includes('armadura')){
        mostrarArmadura();
        return this.falar('Protocolo SAY KORVIL ativado');
    }

    // ===== 13 GAVETAS JARVIS =====
    else if (cmd.includes("cria") || cmd.includes("crie")) return await Cria.executar(cmd);
    else if (cmd.includes("edita") || cmd.includes("manipula")) return await Manipula.executar(cmd);
    else if (cmd.includes("ir para") || cmd.includes("abrir") || cmd.includes("vai")) return await Navega.executar(cmd);
    else if (cmd.includes("copia") || cmd.includes("resuma")) return await Copia.executar(cmd);
    else if (cmd.includes("analisa")) return await Analise.executar(cmd);
    else if (cmd.includes("automatiza")) return await Automacao.executar(cmd);
    else if (cmd.includes("buscar") || cmd.includes("pesquisar")) return await Busca.executar(cmd);
    else if (cmd.includes("calcular") || cmd.includes("somar")) return await Calculo.executar(cmd);
    else if (cmd.includes("hora") || cmd.includes("status") || cmd.includes("data")) return await Sistema.executar(cmd);
    else if (cmd.includes("postar") || cmd.includes("social")) return await Social.executar(cmd);
    else if (cmd.includes("venda") || cmd.includes("lead")) return await Vendas.executar(cmd);
    else if (cmd.includes("aula") || cmd.includes("curso")) return await Educacao.executar(cmd);
    else if (cmd.includes("emergencia")) return await Emergencia.executar(cmd);
    else if (cmd.includes("interface")) return await Interface.executar(cmd);

    // ===== FALLBACK =====
    else {
      const { action, target } = this.parser.parse(cmdOriginal);
      if(action === "create"){
        this.falar(`Criando peça ${target}`);
        await createFile(target, target);
        return;
      }
      return this.falar(`Comando recebido. Tente: criar post, sobe você pro github, se analisa`);
    }
  }

  falar(texto){
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR'; utter.rate = 1.1;
    speechSynthesis.speak(utter);
    window.parent.postMessage({tipo: "resposta", texto: texto}, "*");
    document.getElementById('respostaKai') && (document.getElementById('respostaKai').innerHTML = "K-AI: " + texto);
  }
}

function mostrarArmadura(){
    document.getElementById('armaduraOverlay').style.display = 'block';
}
window.mostrarArmadura = mostrarArmadura;
window.KAI = new KAIBrain();

// ===== CONECTOR GLOBAL =====
window.executarComando = async function(comando){
    return await window.KAI.processarComando(comando);
}
window.falar = (txt)=>window.KAI.falar(txt);
