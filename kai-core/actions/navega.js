
const Navega = {
  // Mapa de todas as páginas do KORVIL
  paginas: {
    "central": { id: "central", nome: "Central", acao: () => window.parent.abrirTela('central') },
    "k-tp": { id: "ktp", nome: "K-TP", acao: () => window.parent.irParaKTP() },
    "k-alma": { id: "kalma", nome: "K-ALMA", acao: () => window.parent.abrirTela('kalma') },
    "sistema k": { id: "sistema", nome: "Sistema K", acao: () => window.parent.abrirTela('sistema') },
    "comunidade": { id: "comunidade", nome: "Comunidade", acao: () => window.parent.abrirTela('comunidade') },
    "whats": { id: "whats", nome: "WhatsApp", acao: () => window.parent.abrirTela('whats') },
    "config": { id: "config", nome: "Configurações", acao: () => window.parent.abrirTela('config') },
    "perfil": { id: "perfil", nome: "Perfil", acao: () => window.parent.abrirTela('perfil') }
  },

  // Função principal que o kai.js chama
  ir(comando) {
    comando = comando.toLowerCase();

    // 1. COMANDOS ESPECIAIS
    if (comando.includes("voltar") || comando.includes("inicio")) {
      return this.voltar();
    }
    if (comando.includes("fechar") || comando.includes("sair")) {
      return this.fechar();
    }
    if (comando.includes("atualizar") || comando.includes("recarregar")) {
      window.parent.location.reload();
      return "Recarregando o KORVIL...";
    }

    // 2. PROCURA A PÁGINA NO MAPA
    for (let chave in this.paginas) {
      if (comando.includes(chave)) {
        const pagina = this.paginas[chave];

        // Valida se a função existe no pai
        if (typeof window.parent.abrirTela === 'function' || typeof window.parent.irParaKTP === 'function') {
          pagina.acao(); // Executa a ação
          this.salvarUltimaPagina(pagina.id);
          return `Ok ${KAI.memoria.nomeUsuario}, indo para ${pagina.nome}.`;
        } else {
          return "Erro: Não consegui conectar com o KORVIL. Recarregue a página.";
        }
      }
    }

    // 3. SE NÃO ACHOU
    return `Não encontrei essa página. Posso ir para: Central, K-TP, K-ALMA, Sistema K, Comunidade, Whats.`;
  },

  voltar() {
    if (window.history.length > 1) {
      window.parent.history.back();
      return "Voltando uma página.";
    } else {
      this.paginas["central"].acao();
      return "Voltando para a Central.";
    }
  },

  fechar() {
    // Manda mensagem pro pai fechar o iframe do K-AI
    window.parent.postMessage({ tipo: "fecharKai" }, "*");
    return "Fechando K-AI.";
  },

  abrirModal(nome) {
    // Pra abrir popups no futuro
    window.parent.postMessage({ tipo: "abrirModal", nome: nome }, "*");
    return `Abrindo ${nome}.`;
  },

  salvarUltimaPagina(id) {
    localStorage.setItem('kai_ultima_pagina', id);
    KAI.memoria.ultimaPagina = id;
  }
}
