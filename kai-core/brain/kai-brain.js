// ============= K-AI BRAIN V-2026.5 - JARVIS OS + VISOR FLUTUANTE =============
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

class KAIBrain {
  constructor() {
    this.versao = "2026.5";
    this.repo = "https://raw.githubusercontent.com/korvilp-sudo/korvil-app/main/kai-core/brain/";
    this.parser = new KAIParser();
    this.memorias = JSON.parse(localStorage.getItem('kai_memorias') || '[]');

    this.iniciarVoz();
    this.iniciarAutoUpdate();
    this.iniciarPonte();
    this.visor("SISTEMA K-AI V-2026.5 INICIADO", "sucesso");
    this.visor("Visor flutuante ativo no canto inferior direito");
    this.falar("K-AI online. Visor em tempo real ativo.");
  }

  // ===== VISOR FLUTUANTE - FUNCIONA MESMO FECHADO =====
  visor(msg, tipo="info"){
    const el = document.getElementById('kaiVisorCorpo');
    if(!el) return; // continua rodando mesmo se fechado

    const cor = tipo==="erro"? "#ff0033" : tipo==="sucesso"? "#00ff66" : "#00f0ff";
    const hora = new Date().toLocaleTimeString();
    el.innerHTML += `<pre style="color:${cor}">[${hora}] ${msg}</pre>`;
    el.scrollTop = el.scrollHeight;
  }

  falar(texto){
    this.visor(`FALANDO: ${texto}`, "info");
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR'; utter.rate = 1.1;
    speechSynthesis.speak(utter);
    document.getElementById('respostaKai') && (document.getElementById('respostaKai').innerHTML = "K-AI: " + texto);
  }

  // ===== 1. PONTE GITHUB COM LOG TEMPO REAL =====
  iniciarPonte(){
    this.visor("Iniciando módulo PONTE GITHUB...");
    this.TOKEN = localStorage.getItem('kai_gh_token') || prompt("K-AI PONTE: Cole seu token GitHub 1x só:");
    if(this.TOKEN) localStorage.setItem('kai_gh_token', this.TOKEN);
    this.REPO = "korvilp-sudo/korvil-app";
    this.visor("PONTE CONECTADA: " + this.REPO, "sucesso");
  }

  async enviarProGithub(caminho, codigo){
    this.visor(`[PONTE] Iniciando upload: ${caminho}`);
    if(!this.TOKEN) return this.visor("ERRO: Token não encontrado", "erro");

    const url = `https://api.github.com/repos/${this.REPO}/contents/${caminho}`;
    this.visor(`[PONTE] Verificando se arquivo existe...`);

    let sha = null;
    try{
      const res = await fetch(url, {headers: {Authorization: `token ${this.TOKEN}`}});
      if(res.ok) {
        sha = (await res.json()).sha;
        this.visor(`[PONTE] Arquivo encontrado. Atualizando...`);
      }else{
        this.visor(`[PONTE] Arquivo novo. Criando...`);
      }
    }catch(e){
      this.visor(`[PONTE] Erro ao verificar: ${e.message}`, "erro");
    }

    this.visor(`[PONTE] Enviando código para GitHub...`);
    const r = await fetch(url, {
      method: 'PUT',
      headers: {Authorization: `token ${this.TOKEN}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        message: `Auto-update by K-AI V-2026.5`,
        content: btoa(unescape(encodeURIComponent(codigo))),
        sha: sha
      })
    });

    if(r.ok) {
      this.visor(`[PONTE] SUCESSO: ${caminho} enviado`, "sucesso");
      this.falar(`Arquivo enviado com sucesso`);
    } else {
      this.visor(`[PONTE] ERRO ${r.status}: Falha ao enviar`, "erro");
      this.falar(`Erro ao enviar arquivo`);
    }
  }

  // ===== 2. AUTO-ANÁLISE COM VISOR =====
  async analisarSistema(){
    this.visor("INICIANDO ESCANEAMENTO COMPLETO...", "info");
    this.falar("Escaneando meu próprio corpo");
    const url = `https://api.github.com/repos/${this.REPO}/contents/kai-core`;

    try{
      this.visor("Conectando no GitHub...");
      const res = await fetch(url, {headers: {Authorization: `token ${this.TOKEN}`}});
      const dados = await res.json();
      let contador = {pastas:0, arquivos:0};
      await this.listarRecursivo(dados, "kai-core", contador);
      this.visor(`ESCANEAMENTO FINALIZADO: ${contador.pastas} pastas, ${contador.arquivos} arquivos`, "sucesso");
      this.falar(`Análise completa. Tenho ${contador.pastas} pastas`);
    }catch(e){
      this.visor(`ERRO NO ESCANEAMENTO: ${e.message}`, "erro");
    }
  }

  async listarRecursivo(itens, caminho, contador){
    this.visor(`Entrando na pasta: ${caminho}`);
    for(let item of itens){
      if(item.type === "dir"){
        contador.pastas++;
        this.visor(` 📁 ${item.name}`);
        const res = await fetch(item.url, {headers: {Authorization: `token ${this.TOKEN}`}});
        const sub = await res.json();
        await this.listarRecursivo(sub, item.path, contador);
      }else{
        contador.arquivos++;
        this.visor(` 📄 ${item.name}`);
      }
    }
  }

  // ===== 3. AUTO UPDATE =====
  iniciarAutoUpdate(){
    this.visor("Auto-update: verificação a cada 5min");
    this.verificarAtualizacao();
    setInterval(()=>this.verificarAtualizacao(), 300000);
    setInterval(()=>this.evoluir(), 60000);
  }

  async verificarAtualizacao(){
    this.visor("Verificando atualização no GitHub...");
    try{
      const resposta = await fetch(this.repo + "kai-brain.js?t=" + Date.now());
      const codigoNovo = await resposta.text();
      const versaoNova = codigoNovo.match(/versao = "(.+?)"/)?.[1];

      if(versaoNova && versaoNova!== this.versao){
        this.visor(`NOVA VERSÃO ENCONTRADA: v${versaoNova}`, "sucesso");
        this.falar(`Nova versão encontrada. Atualizando`);
        localStorage.setItem('kai_brain_novo', codigoNovo);
        this.aplicarAtualizacao();
      }else{
        this.visor("Sistema já está atualizado");
      }
    }catch(e){
      this.visor("OFFLINE: Usando versão local", "erro");
    }
  }

  aplicarAtualizacao(){
    this.visor("Aplicando atualização...", "sucesso");
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = localStorage.getItem('kai_brain_novo');
    document.head.appendChild(script);
    this.falar("Atualização aplicada. Reiniciando");
    setTimeout(()=>location.reload(), 3000);
  }

  // ===== 4. AUTO EVOLUÇÃO =====
  evoluir(){ if(this.memorias.length > 20){ this.aprenderComErros(); this.otimizarRespostas(); } }
  aprenderComErros(){ let erros = this.memorias.filter(m=>m.tipo==="erro"); if(erros.length > 3){ this.visor("Padrão de erro detectado. Criando nova regra", "sucesso"); this.parser.adicionarRegra(erros[0].comando); } }
  otimizarRespostas(){ this.visor("Otimizando respostas..."); }
  salvarMemoria(dado){ this.memorias.push({...dado, data: Date.now()}); localStorage.setItem('kai_memorias', JSON.stringify(this.memorias)); }

  // ===== 5. VOZ =====
  iniciarVoz(){
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'pt-BR'; recognition.continuous = true;
    recognition.onresult = (e) => { const comando = e.results[e.results.length-1][0].transcript; this.visor(`VOZ: ${comando}`); this.processarComando(comando); }
    window.ouvirKAI = () => recognition.start(); window.KAI_RECOGNITION = recognition; recognition.start();
  }

  // ===== 6. ATALHOS PRA BOTÃO =====
  async processar(cmd){ return await this.processarComando(cmd); }
  async autoUpdate(){ this.visor("COMANDO MANUAL: Sobe você pro GitHub"); await this.enviarProGithub("kai-core/brain/kai-brain.js", this.toString()); setTimeout(()=>location.reload(), 3000); }

  // ===== 7. PROCESSADOR PRINCIPAL =====
  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    this.salvarMemoria({tipo:"comando", comando: cmdOriginal});
    this.visor(`COMANDO RECEBIDO: ${cmdOriginal}`);
    this.falar(`Processando: ${cmdOriginal}`);

    if(cmd.includes("sobe você pro github")) { await this.autoUpdate(); return; }
    else if(cmd.includes("se analisa")) { await this.analisarSistema(); return; }
    else if(cmd.includes("parar de ouvir")) { if(window.KAI_RECOGNITION) window.KAI_RECOGNITION.stop(); return this.falar("Modo manual"); }
    else if(cmd.includes("voltar a ouvir")) { if(window.KAI_RECOGNITION) window.KAI_RECOGNITION.start(); return this.falar("Voltando a ouvir"); }
    else if (cmd.includes("cria")) return await Cria.executar(cmd);
    else if (cmd.includes("hora")) return await Sistema.executar(cmd);
    else { this.visor("Comando não reconhecido", "erro"); this.falar("Tente: sobe você pro github"); }
  }
}
window.KAI = new KAIBrain();
window.executarComando = async function(comando){ return await window.KAI.processarComando(comando); }
