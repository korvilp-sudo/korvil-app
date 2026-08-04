// ============= DENTRO DO KAI_BRAIN =============
  constructor(){
    this.parser = new KAIParser(); // AGORA USA A CLASSE
    //... resto
  }

  processar(comando){
    this.salvarMemoria({tipo:"comando", comando, data:Date.now()});
    let acao = this.parser.parse(comando); // usa a classe
    return KAI_EXECUTOR.executar(acao);
  },

  aprenderComErros(){
    let erros = this.memorias.filter(m=>m.tipo==="erro");
    if(erros.length > 3){
      this.falar("Detectei padrão de erro. Ajustando parser...");
      this.parser.adicionarRegra(erros[0].comando); // usa método da classe
    }
  },
