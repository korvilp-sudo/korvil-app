

// ===== CÉREBRO SEPARADO - 9 GAVETAS + MEMÓRIA =====
const KAI_BRAIN = {
  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    let resposta = "";

    // ===== 1. ATALHOS SISTEMA =====
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

    // ===== 2. COMANDOS DE MEMÓRIA =====
    else if (cmd.includes("lembrar") || cmd.includes("salvar memória")) {
      const memoria = cmd.replace("lembrar","").replace("salvar memória","").trim();
      if(memoria){
        resposta = KAI_MEMORY.salvarMemoriaImportante(memoria);
      } else {
        resposta = "O que devo lembrar Chefe?";
      }
    }
    else if (cmd.includes("o que você lembra") || cmd.includes("buscar memória")) {
      const termo = cmd.replace("o que você lembra","").replace("buscar memória","").trim() || "tudo";
      resposta = KAI_MEMORY.buscarNaMemoria(termo);
    }
    else if (cmd.includes("estatísticas") || cmd.includes("relatório")) {
      const stats = KAI_MEMORY.getEstatisticas();
      resposta = `Relatório K-AI: ${stats.total_conversas} conversas. ${stats.memorias_salvas} memórias importantes. Ativo há ${stats.dias_ativo} dias.`;
    }
    else if (cmd.includes("limpar memória")) {
      resposta = KAI_MEMORY.limpar();
    }

    // ===== 3. CHAMADAS DAS 9 GAVETAS =====
    else if (cmd.includes("vai") || cmd.includes("abrir")) {
      resposta = Navega.ir(cmd);
    }
    else if (cmd.includes("cria")) {
      resposta = await Cria.executar(cmd);
    }
    else if (cmd.includes("copia") || cmd.includes("resuma") || cmd.includes("analisa") || cmd.includes("traduz")) {
      resposta = await Copia.executar(cmd);
    }
    else if (cmd.includes("hora") || cmd.includes("salvar") || cmd.includes("data") || cmd.includes("status")) {
      resposta = await Sistema.executar(cmd);
    }
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

    // ===== 4. FALLBACK =====
    else {
      resposta = `Comando recebido: "${cmdOriginal}". Tente: criar post, copiar tudo, pesquisar algo, lembrar que...`;
    }

    // ===== 5. FALA + SALVA NA MEMÓRIA =====
    KAI_UI.falar(resposta);
    KAI_MEMORY.adicionarConversa(cmdOriginal, resposta); // SALVA TUDO AUTOMATICO
  }
}
