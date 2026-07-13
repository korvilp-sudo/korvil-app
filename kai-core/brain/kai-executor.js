
// ===== MOTOR DE COMANDOS K-AI EXECUTOR V-2026.1 =====
async function executar(comandoOriginal){
    if(!comandoOriginal) return;

    let comando = comandoOriginal.toLowerCase().trim();
    addMsg('me', comandoOriginal);
    let respondido = false;

    // 1. PARSE DE COMANDOS "CRIAR / EDITAR"
    if(comando.includes("cria peça")){
        const peca = comando.split("cria peça ")[1];
        await criarArquivoKAI(peca);
        respondido = true;
    }
    else if(comando.includes("edita")){
        const peca = comando.split("edita ")[1];
        await editarArquivoKAI(peca);
        respondido = true;
    }
    else if(comando.includes("lista peças")){
        listarPecasKAI();
        respondido = true;
    }

    // 2. COMANDOS ACTIONS - SEUS 14 MÓDULOS
    const comandos = {
        // ACTIONS CORE
        "analise": () => { falar("Executando módulo de Análise de dados"); addNoti("📊 ANÁLISE INICIADA"); },
        "automacao": () => { falar("Módulo de Automação ativado"); addNoti("⚙️ AUTOMAÇÃO"); },
        "busca": () => { falar("Iniciando busca na base KORVIL"); },
        "calculo": () => { falar("Módulo de Cálculo ativo"); },
        "copia": () => { falar("Função de Cópia executada"); },
        "cria": () => { falar("Para criar diga: cria peça peito, dorso, braço"); },
        "educacao": () => { falar("Acessando base de Educação K-AI"); },
        "emergencia": () => {
            falar("PROTOCOLO DE EMERGÊNCIA ATIVADO");
            document.body.style.background='red';
            addNoti("🚨 EMERGÊNCIA");
            setTimeout(()=>document.body.style.background='var(--bg)',3000)
        },
        "interface": () => { falar("Reconfigurando interface"); },
        "manipula": () => { falar("Módulo de Manipulação ativo"); },
        "navega": () => { falar("Sistema de Navegação ativo. Para onde vamos?"); },
        "sistema": () => { falar("Diagnóstico de Sistema completo"); openTable('right'); },
        "social": () => { falar("Conectando redes sociais"); },
        "vendas": () => { falar("Módulo de Vendas ativado"); },

        // ARMADURA V-2026
        "transformar": () => iniciarTransformacao(),
        "armadura v2026": () => iniciarTransformacao(),
        "modo combate": () => { falar("Modo combate ativado"); modoArmadura('combate'); },
        "modo furtivo": () => { falar("Modo furtivo ativado"); modoArmadura('furtivo'); },
        "modo voo": () => { falar("Propulsores ligados. Modo voo ativado"); modoArmadura('voo'); },

        // SISTEMA
        "limpar memória": () => limparMem(),
        "salvar memória": () => { salvarMem(); falar("Memória salva"); },
        "estatísticas": () => openTable('right'),
        "que horas são": () => falar(`Agora são ${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`)
    };

    // 3. EXECUTA SE ENCONTRAR O COMANDO
    if(!respondido){
        for(let key in comandos){
            if(comando.includes(key)){
                comandos[key]();
                respondido = true;
                break;
            }
        }
    }

    // 4. SE NÃO RECONHECER
    if(!respondido) {
        falar("Comando não reconhecido Chefe. Diga: cria, edita, ou lista peças");
        addNoti(`❓ Comando: ${comandoOriginal}`);
    }

    updateStats();
}

// ===== FUNÇÕES DO EXECUTOR =====

// 1. CRIAR ARQUIVO
async function criarArquivoKAI(nome){
    const templates = {
        "peito": `
<!DOCTYPE html><html lang="pt-BR"><head><title>K-AI PEITO V-2026</title>
<style>body{background:#000;color:#00FFFF;text-align:center;font-family:Segoe UI}
.reactor{width:200px;height:200px;border:5px solid #00FFFF;border-radius:50%;margin:50px auto;box-shadow:0 0 50px #00FFFF;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}</style>
</head><body><div class="reactor"></div><h1>NÚCLEO K-AI</h1><p>ENERGIA: <span id="energy">100%</span></p></body></html>`,

        "dorso": `
<!DOCTYPE html><html lang="pt-BR"><head><title>K-AI DORSO V-2026</title>
<style>body{background:#000;color:#00FFFF;text-align:center;font-family:Segoe UI}
.propulsor{width:100px;height:300px;background:linear-gradient(#00FFFF, transparent);margin:20px auto;border-radius:10px}</style>
</head><body><div class="propulsor"></div><h1>SISTEMA DE VOO V-2026</h1></body></html>`,

        "braço": `
<!DOCTYPE html><html lang="pt-BR"><head><title>K-AI BRAÇO V-2026</title>
<style>body{background:#000;color:#00FFFF;font-family:Segoe UI}</style>
</head><body><h1>SISTEMA DE ARMAS</h1><p>Repulsor: OFF</p></body></html>`
    };

    const codigo = templates[nome] || templates.peito;
    const blob = new Blob([codigo], {type: 'text/html'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nome}.html`;
    link.click();

    falar(`Arquivo ${nome}.html criado. Faça upload em kai-transformar/v2026/pecas`);
    addNoti(`✨ ${nome}.html criado`);
}

// 2. EDITAR ARQUIVO
async function editarArquivoKAI(nome){
    falar(`Para editar ${nome}.html me envie o código atual aqui no chat`);
    addNoti(`📝 Aguardando código de ${nome}.html`);
    window.aguardandoEdicao = nome; // Flag pra saber qual arquivo editar
}

// 3. LISTAR PEÇAS
function listarPecasKAI(){
    const pecas = ['capacete', 'visor', 'fones', 'bico-de-corvo', 'peito', 'dorso'];
    falar(`Você tem ${pecas.length} peças: ${pecas.join(", ")}`);
    addNoti(`📋 Peças: ${pecas.join(", ")}`);
}

// 4. CAPTURAR CÓDIGO PRA EDITAR
// Adiciona isso no seu send()
const inputOriginal = document.getElementById('input');
const sendOriginal = window.send;
window.send = function(){
    const input = document.getElementById('input');
    if(window.aguardandoEdicao && input.value.includes("<html")){
        editarECriarArquivo(window.aguardandoEdicao, input.value);
        window.aguardandoEdicao = null;
    } else {
        sendOriginal();
    }
}

async function editarECriarArquivo(nome, novoCodigo){
    const blob = new Blob([novoCodigo], {type: 'text/html'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nome}_EDITADO.html`;
    link.click();
    falar(`${nome} editado e baixado`);
    addNoti(`✅ ${nome}_EDITADO.html pronto`);
}

// 5. MODO ARMADURA
function modoArmadura(modo){
    const canvas = document.getElementById('armaduraCanvas');
    if(modo === 'combate') {
        canvas.style.filter = 'hue-rotate(0deg) brightness(1.4)';
        falar("HUD de combate ativo");
    }
    if(modo === 'furtivo') {
        canvas.style.filter = 'brightness(0.2)';
        falar("Modo furtivo. Reduzindo assinatura");
    }
    if(modo === 'voo') {
        falar("Propulsores ligados. Simulando voo");
    }
}
