const Navega = {
  // ROTAS QUE JÁ EXISTEM NO SEU APP.HTML
  rotasInternas: {
    "central": "central",
    "sistema k": "sistema",
    "k-tp": "ktp-iframe",
    "k-afortunado": "kafortunado",
    "k-alma": "kalma",
    "humano": "humano",
    "desenvolvimento humano": "humano",
    "negocios": "negocios",
    "servicos": "servicos",
    "inicio": "central",
    "home": "central",
    "menu": "central",
    "voltar": "central"
  },

  ir(comando) {
    let pagina = comando.replace("vai para", "").replace("abrir", "").replace("ir para", "").replace("acessar", "").trim().toLowerCase();

    // ATALHOS POR NUMERO
    if(pagina.includes("1") || pagina.includes("sistema")) pagina = "sistema k";
    if(pagina.includes("2") || pagina.includes("tp")) pagina = "k-tp";
    if(pagina.includes("3") || pagina.includes("afortunado")) pagina = "k-afortunado";
    if(pagina.includes("4") || pagina.includes("alma")) pagina = "k-alma";
    if(pagina.includes("5") || pagina.includes("central")) pagina = "central";
    if(pagina.includes("6") || pagina.includes("humano")) pagina = "humano";
    if(pagina.includes("7") || pagina.includes("negocio")) pagina = "negocios";
    if(pagina.includes("8") || pagina.includes("servico")) pagina = "servicos";

    // PROCURA NAS ROTAS INTERNAS
    for(let chave in this.rotasInternas){
      if(pagina.includes(chave)){
        const idTela = this.rotasInternas[chave];

        // CASO ESPECIAL K-TP QUE USA IFRAME
        if(idTela === "ktp-iframe"){
          window.parent.irParaKTP(); // chama a função que já existe no app
        } else {
          window.parent.abrirTela(idTela); // chama a função que já existe no app
        }

        return `Abrindo ${chave.toUpperCase()}.`;
      }
    }

    return `Página "${pagina}" não encontrada. Diga: central, sistema k, k-tp, k-afortunado, k-alma, humano, negocios ou servicos`;
  }
}const Navega = {
  // ROTAS QUE JÁ EXISTEM NO SEU APP.HTML
  rotasInternas: {
    "central": "central",
    "sistema k": "sistema",
    "k-tp": "ktp-iframe",
    "k-afortunado": "kafortunado",
    "k-alma": "kalma",
    "humano": "humano",
    "desenvolvimento humano": "humano",
    "negocios": "negocios",
    "servicos": "servicos",
    "inicio": "central",
    "home": "central",
    "menu": "central",
    "voltar": "central"
  },

  ir(comando) {
    let pagina = comando.replace("vai para", "").replace("abrir", "").replace("ir para", "").replace("acessar", "").trim().toLowerCase();

    // ATALHOS POR NUMERO
    if(pagina.includes("1") || pagina.includes("sistema")) pagina = "sistema k";
    if(pagina.includes("2") || pagina.includes("tp")) pagina = "k-tp";
    if(pagina.includes("3") || pagina.includes("afortunado")) pagina = "k-afortunado";
    if(pagina.includes("4") || pagina.includes("alma")) pagina = "k-alma";
    if(pagina.includes("5") || pagina.includes("central")) pagina = "central";
    if(pagina.includes("6") || pagina.includes("humano")) pagina = "humano";
    if(pagina.includes("7") || pagina.includes("negocio")) pagina = "negocios";
    if(pagina.includes("8") || pagina.includes("servico")) pagina = "servicos";

    // PROCURA NAS ROTAS INTERNAS
    for(let chave in this.rotasInternas){
      if(pagina.includes(chave)){
        const idTela = this.rotasInternas[chave];

        // CASO ESPECIAL K-TP QUE USA IFRAME
        if(idTela === "ktp-iframe"){
          window.parent.irParaKTP(); // chama a função que já existe no app
        } else {
          window.parent.abrirTela(idTela); // chama a função que já existe no app
        }

        return `Abrindo ${chave.toUpperCase()}.`;
      }
    }

    return `Página "${pagina}" não encontrada. Diga: central, sistema k, k-tp, k-afortunado, k-alma, humano, negocios ou servicos`;
  }
}
