// ============= K-B.D FORJA v8.2 - K-AI CÉREBRO =============
const K_AI = {
  ativo: false,
  memorias: [],

  processarComando(comando){
    if(!this.ativo) return "K-AI está desativado. Clique em ATIVAR K-AI";
    comando = comando.toLowerCase();
    this.salvarMemoria(`Comando recebido: ${comando}`);

    if(comando.includes('criar')) return this.construirEstrutura(comando);
    if(comando.includes('analisar')) return this.analisarCodigo();
    if(comando.includes('cgm')) return this.toggleCGM();
    if(comando.includes('salvar')) { document.getElementById('confirmarBtn').click(); return "Salvo!"; }

    return `Comando não reconhecido: ${comando}. Tente: criar, analisar, cgm`;
  },

  construirEstrutura(comando){
    processarComandoUnificado(comando);
    HISTORICO.adicionar("Comando K-AI", ARQUIVO_SELECIONADO);
    return `Estrutura montada: ${comando}`;
  },

  analisarCodigo(){
    let codigo = editor.value;
    let linhas = codigo.split('\n').length;
    return `Analisei ${ARQUIVO_SELECIONADO}. ${linhas} linhas, ${codigo.length} caracteres. Código OK.`;
  },

  toggleCGM(){
    document.getElementById('ativarCGMBTN').click();
    return cgmAtivo? "CGM Ativado. Mova a mão para controlar." : "CGM Desativado";
  },

  salvarMemoria(texto){
    this.memorias.push({data: new Date(), texto});
    salvarMemoriaKai(texto);
    console.log("K-AI MEMÓRIA:", texto);
  }
};

// BOTÕES DO MENU DO CUBO
document.getElementById('perguntarKaiBtn').onclick = () => {
  let pergunta = prompt("Pergunte ao K-AI:");
  if(pergunta) falarKai(K_AI.processarComando(pergunta));
}
document.getElementById('analisarCodigoBtn').onclick = () => falarKai(K_AI.analisarCodigo());
document.getElementById('sugerirMelhoriaBtn').onclick = () => falarKai("Sugestão: Adicione comentários e separe em funções menores.");

console.log("K-AI CÉREBRO CARREGADO");
