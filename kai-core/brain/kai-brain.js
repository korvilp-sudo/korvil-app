// K-AI BRAIN V-2026.2 - JARVIS OS COMPLETO
import * as Cria from './actions/cria.js';
import * as Navega from './actions/navega.js';
import * as Sistema from './actions/sistema.js';
import * as Copia from './actions/copia.js';
import * as Busca from './actions/busca.js';
import * as Calculo from './actions/calculo.js';
import * as Social from './actions/social.js';
import * as Vendas from './actions/vendas.js';
import * as Educacao from './actions/educacao.js';
import { KAIParser } from './kai-parser.js';
import { createFile } from '../commands/create.js';

// ===== CÉREBRO PRINCIPAL =====
class KAIBrain {
  constructor() {
    this.parser = new KAIParser();
    this.iniciarVoz();
    this.falar("K-AI V-2026.2 online. Protocolo Say Korvil ativo");
  }

  iniciarVoz(){
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'pt-BR';

    recognition.onresult = (e) => {
      const comando = e.results[0][0].transcript;
      console.log("Comando recebido:", comando);
      this.processarComando(comando);
    }

    // Botão pra segurar e falar
    window.ouvirKAI = () => recognition.start();
    window.KAI_RECOGNITION = recognition; // deixa global pra parar/voltar
  }

  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    this.falar(`Processando: ${cmdOriginal}`);

    // ===== 1. ATALHOS SISTEMA =====
    if(cmd.includes("parar de ouvir")) {
      if(window.KAI_RECOGNITION) window.KAI_RECOGNITION.stop();
      return this.falar("Modo manual ativado Chefe");
    }
    else if(cmd.includes("voltar a ouvir")) {
      if(window.KAI_RECOGNITION) window.KAI_RECOGNITION.start();
      return this.falar("Voltando a ouvir");
    }

    // ===== 2. COMANDOS DE MEMÓRIA =====
    else if (cmd.includes("lembrar") || cmd.includes("salvar memória")) {
      const memoria = cmdOriginal.replace(/lembrar|salvar memória/gi,"").trim();
      if(memoria){
        localStorage.setItem('kai-mem-' + Date.now(), memoria);
        return this.falar(`Memória salva: ${memoria}`);
      } else {
        return this.falar("O que devo lembrar Chefe?");
      }
    }
    else if (cmd.includes("o que você lembra") || cmd.includes("buscar memória")) {
      let chaves = Object.keys(localStorage).filter(k => k.startsWith('kai-mem-'));
      return this.falar(`Tenho ${chaves.length} memórias salvas`);
    }
    else if (cmd.includes("limpar memória")) {
      Object.keys(localStorage).forEach(k => {if(k.startsWith('kai-mem-')) localStorage.removeItem(k)});
      return this.falar("Memória limpa");
    }

    // ===== 3. K-AI TRANSFORMAR =====
    else if(cmd.includes('transformar') || cmd.includes('armadura')){
        mostrarArmadura();
        return this.falar('Protocolo SAY KORVIL ativado');
    }

    // ===== 4. CHAMADAS DAS 9 GAVETAS =====
    else if (cmd.includes("vai") || cmd.includes("abrir") || cmd.includes("ir para")) {
      return await Navega.executar(cmd);
    }
    else if (cmd.includes("cria") || cmd.includes("crie")) {
      return await Cria.executar(cmd);
    }
    else if (cmd.includes("copia") || cmd.includes("resuma") || cmd.includes("analisa") || cmd.includes("traduz")) {
      return await Copia.executar(cmd);
    }
    else if (cmd.includes("hora") || cmd.includes("salvar") || cmd.includes("data") || cmd.includes("status")) {
      return await Sistema.executar(cmd);
    }
    else if (cmd.includes("buscar") || cmd.includes("pesquisar")) {
      return await Busca.executar(cmd);
    }
    else if (cmd.includes("calcular") || cmd.includes("somar") || cmd.includes("dividir") || cmd.includes("multiplicar")) {
      return await Calculo.executar(cmd);
    }
    else if (cmd.includes("postar") || cmd.includes("instagram") || cmd.includes("social")) {
      return await Social.executar(cmd);
    }
    else if (cmd.includes("lead") || cmd.includes("venda") || cmd.includes("proposta")) {
      return await Vendas.executar(cmd);
    }
    else if (cmd.includes("aula") || cmd.includes("curso") || cmd.includes("aprender")) {
      return await Educacao.executar(cmd);
    }

    // ===== 5. PARSER ANTIGO =====
    else {
      const { action, target } = this.parser.parse(cmdOriginal);
      if(action === "create"){
        this.falar(`Criando peça ${target}`);
        await createFile(target, target);
        return;
      }
    }

    // ===== 6. FALLBACK =====
    return this.falar(`Comando recebido. Tente: criar post, ir para sistema K, que horas são`);
  }

  falar(texto){
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR'; utter.rate = 1.1;
    speechSynthesis.speak(utter);
    // Manda pra Central também
    window.parent.postMessage({tipo: "resposta", texto: texto}, "*");
  }
}

function mostrarArmadura(){
    document.getElementById('armaduraOverlay').style.display = 'block';
}
window.mostrarArmadura = mostrarArmadura;

window.KAI = new KAIBrain();
