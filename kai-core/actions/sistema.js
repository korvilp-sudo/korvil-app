
const Sistema = {

  // BANCO DE MEMÓRIA LOCAL
  memoriaLocal: {
    get(chave) {
      return localStorage.getItem(`kai_${chave}`);
    },
    set(chave, valor) {
      localStorage.setItem(`kai_${chave}`, valor);
    },
    getJSON(chave) {
      const item = localStorage.getItem(`kai_${chave}`);
      return item? JSON.parse(item) : null;
    },
    setJSON(chave, valor) {
      localStorage.setItem(`kai_${chave}`, JSON.stringify(valor));
    }
  },

  // FUNÇÃO PRINCIPAL
  async executar(comando) {
    comando = comando.toLowerCase();

    // 1. MEMÓRIA: SALVAR E LEMBRAR
    if (comando.includes("lembrar") || comando.includes("salvar") || comando.includes("anote")) {
      const info = comando.replace(/lembrar|salvar|anote que/gi, "").trim();
      let memorias = this.memoriaLocal.getJSON("memorias") || [];
      memorias.push({ data: new Date().toISOString(), info: info });
      this.memoriaLocal.setJSON("memorias", memorias);
      return `Anotado ${KAI.memoria.nomeUsuario}. Vou lembrar de: "${info}"`;
    }

    if (comando.includes("o que você lembra") || comando.includes("memoria")) {
      let memorias = this.memoriaLocal.getJSON("memorias") || [];
      if (memorias.length === 0) return "Ainda não salvei nada na memória.";
      let lista = memorias.slice(-5).map(m => `- ${m.info}`).join('\n');
      return `**Aqui estão suas últimas 5 memórias:**\n${lista}`;
    }

    if (comando.includes("esquecer")) {
      localStorage.removeItem('kai_memorias');
      return "Memória limpa. Esqueci tudo.";
    }

    // 2. SISTEMA: HORA, DATA, DIA
    if (comando.includes("hora") || comando.includes("que horas")) {
      const hora = new Date().toLocaleTimeString('pt-BR');
      return `Agora são ${hora}`;
    }

    if (comando.includes("data") || comando.includes("que dia")) {
      const data = new Date().toLocaleDateString('pt-BR');
      return `Hoje é ${data}`;
    }

    // 3. CONFIGURAÇÕES DO K-AI
    if (comando.includes("mudar nome") || comando.includes("me chame de")) {
      const novoNome = comando.split("de")[1]?.trim();
      if (novoNome) {
        KAI.memoria.nomeUsuario = novoNome;
        this.memoriaLocal.set("nomeUsuario", novoNome);
        return `Ok. De agora em diante vou te chamar de ${novoNome}`;
      }
    }

    if (comando.includes("configuração") || comando.includes("ajustes")) {
      return `**Configurações K-AI:**\nModo: ${KAI.configVoz.modo}\nVoz: ${KAI.configVoz.genero}\nMemórias: ${this.memoriaLocal.getJSON("memorias")?.length || 0}`;
    }

    // 4. SUPABASE: SALVAR NA NUVEM - PRONTO PRA CONECTAR
    if (comando.includes("salvar na nuvem") || comando.includes("sync")) {
      await this.salvarNoSupabase();
      return "Sincronizando suas memórias com a nuvem KORVIL...";
    }

    // 5. UTILITÁRIOS
    if (comando.includes("limpar chat") || comando.includes("apagar conversa")) {
      document.getElementById('chatBox').innerHTML = `<div class="msg kai"><b>K-AI:</b> Chat limpo. Como posso ajudar?</div>`;
      return "Conversa limpa.";
    }

    if (comando.includes("reiniciar") || comando.includes("resetar")) {
      window.location.reload();
      return "Reiniciando K-AI...";
    }

    return "Não entendi o comando de sistema. Posso: Salvar memória, Ver hora, Mudar nome, Limpar chat.";
  },

  // FUNÇÃO PRA CONECTAR COM SUPABASE DEPOIS
  async salvarNoSupabase() {
    const memorias = this.memoriaLocal.getJSON("memorias");
    const nome = this.memoriaLocal.get("nomeUsuario");

    // AQUI ENTRA SEU CÓDIGO DO SUPABASE
    // const { data, error } = await supabase.from('kai_memorias').insert([{ user_id: 'paulo', memorias, nome }])

    console.log("Enviando pro Supabase:", { memorias, nome });
    // Por enquanto só loga. Depois conectamos.
  },

  // CARREGAR MEMÓRIA AO INICIAR
  carregar() {
    const nomeSalvo = this.memoriaLocal.get("nomeUsuario");
    if (nomeSalvo) KAI.memoria.nomeUsuario = nomeSalvo;
  }
}

// Carrega ao iniciar o kai.js
Sistema.carregar();
