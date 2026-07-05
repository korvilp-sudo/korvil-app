
const Copia = {
  async executar(comando) {
    comando = comando.toLowerCase();

    // 1. COPIAR TEXTO
    if (comando.includes("copia")) {
      const texto = comando.replace("copia", "").trim();
      navigator.clipboard.writeText(texto);
      return `Texto copiado para área de transferência: "${texto}"`;
    }

    // 2. RESUMIR TEXTO
    if (comando.includes("resuma") || comando.includes("resumo")) {
      const texto = comando.replace(/resuma|resumo|isso|isso aqui/gi, "").trim();
      if (texto.length < 10) return "Me mande o texto ou anexe um arquivo que eu resumo.";
      // Simula resumo
      return `**Resumo K-AI:**\nO texto fala sobre os pontos principais de forma direta. Foco em ação, resultado e desenvolvimento. Quer que eu faça um resumo em tópicos?`;
    }

    // 3. TRADUZIR
    if (comando.includes("traduz")) {
      const partes = comando.split("para");
      const texto = partes[0].replace("traduz", "").trim();
      const idioma = partes[1]?.trim() || "inglês";
      return `**Tradução para ${idioma}:**\n[Tradução simulada de: "${texto}"]\n\nQuer que eu fale a tradução também?`;
    }

    // 4. ANALISAR ANEXO - PRONTO PRA CONECTAR
    if (comando.includes("analisa") || comando.includes("leia") || comando.includes("anexo")) {
      return `Pode enviar o arquivo com o botão 📎.\nEu leio: PDF, Imagem,.txt. E te devolvo um resumo.`;
    }

    // 5. EXPLICAR
    if (comando.includes("explique") || comando.includes("o que é")) {
      const tema = comando.replace(/explique|o que é/gi, "").trim();
      return `**Explicação K-AI sobre ${tema}:**\n${tema} é um conceito importante dentro do KORVIL. Quer que eu aprofunde em 3 tópicos sobre isso?`;
    }

    return "Posso: Copiar, Resumir, Traduzir, Explicar e Analisar anexos.";
  },

  // FUNÇÃO PRA LER PDF/IMAGEM DEPOIS
  async lerArquivo(file) {
    console.log("Lendo arquivo:", file.name);

    // AQUI ENTRA: TESSERACT.JS pra imagem, PDF.JS pra pdf
    // const texto = await extrairTexto(file);

    return `Arquivo "${file.name}" recebido. Extraindo texto...`;
  }
}
