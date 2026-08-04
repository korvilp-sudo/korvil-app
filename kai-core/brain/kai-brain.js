// ============= K-AI BRAIN V-2026.3 - JARVIS OS AUTO EVOLUTIVO =============
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

// ===== CÉREBRO PRINCIPAL COM AUTO UPDATE =====
class KAIBrain {
  constructor() {
    this.versao = "2026.3";
    this.repo = "https://raw.githubusercontent.com/korvilp-sudo/korvil-app/main/kai-core/brain/";
    this.parser = new KAIParser();
    this.memorias = JSON.parse(localStorage.getItem('kai_memorias') || '[]');
    this.iniciarVoz();
    this.iniciarAutoUpdate();
    this.falar("K-AI V-2026.3 online. Protocolo Say Korvil ativo. Auto-update ligado.");
  }

  // ===== 1. AUTO UPDATE VIA GITHUB =====
  iniciarAutoUpdate(){
    this.verificarAtualizacao(); // verifica na hora
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

  // ===== 2. AUTO EVOLUÇÃO =====
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

  // ===== 3. VOZ =====
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
    recognition.start(); // já liga automático
  }

  // ===== 4. PROCESSADOR PRINCIPAL - JUNÇÃO DAS 13 GAVETAS =====
  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    this.salvarMemoria({tipo:"comando", comando: cmdOriginal});
    this.falar(`Processando: ${cmdOriginal}`);

    // ===== ATALHOS SISTEMA =====
    if(cmd.includes("parar de ouvir")) {
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
      return this.falar(`Comando recebido. Tente: criar post, ir para sistema K, que horas são`);
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
