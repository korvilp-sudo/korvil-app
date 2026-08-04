// ============= K-B.D FORJA v8.2 - MOTOR PRINCIPAL =============
const dadosForja = {
  acoes:[ "Criar", "Editar", "Atualizar", "Mover", "Excluir" ],
  tipos:[ "Setor", "Área", "Serviço", "Arquivo" ],
  setores:[ "Sistema K", "K-TP", "K-AFORTUNADO", "K-ALMA", "CENTRAL K", "K-OS" ],
  areas:[ "Tecnologias", "Treinamento Personalizado", "Saúde", "Finanças", "Academia", "Barbearia" ],
  servicos:[ "Projeto TRANSFORMAÇÃO", "Consultoria", "Mentoria", "Barbeiro", "Massoterapia", "Nutrição" ],
  categorias:[ "Curso", "Produto", "Documento", "Sistema" ],
  arquivos:[ "index.html", "app.js", "style.css", "core.js", "db.js", "kai.js" ],
  pasta:[ "Assets", "Components", "Pages", "Core" ]
};

// SANDBOX = TESTES | KORVIL_REPO = REAL
const KORVIL_REPO = {
  "index.html":"<!-- KORVIL OS -->",
  "style.css":"/* KORVIL */",
  "app.js":"// KORVIL"
};
let SANDBOX = {...KORVIL_REPO};
let ARQUIVO_SELECIONADO = "index.html";
let PENDENTE_COMMIT = false;

// ELEMENTOS
const editor=document.getElementById("editor");
const previewContainer=document.getElementById("preview-container");

function carregarSelect(id,array){
  const select=document.getElementById(id);
  if(!select) return;
  select.innerHTML='';
  array.forEach(item=>{
    const option=document.createElement("option");
    option.textContent=item;
    select.appendChild(option);
  });
}
Object.keys(dadosForja).forEach(k=>carregarSelect(k,dadosForja[k]));

// CARREGAR ARQUIVO
document.getElementById('arquivo').onchange = e=>{
  ARQUIVO_SELECIONADO = e.target.value;
  editor.value = SANDBOX[ARQUIVO_SELECIONADO] || "";
  document.getElementById('status-arquivo').textContent = `ARQUIVO ATUAL: ${ARQUIVO_SELECIONADO}`;
  atualizarPreview();
}

// EDITAR = ATUALIZA SANDBOX
editor.addEventListener('input',()=>{
  SANDBOX[ARQUIVO_SELECIONADO] = editor.value;
  PENDENTE_COMMIT = true;
  atualizarPreview();
});

function atualizarPreview(){
  const codigo = SANDBOX[ARQUIVO_SELECIONADO];
  if(ARQUIVO_SELECIONADO.includes('.html')){
    previewContainer.innerHTML = `<iframe srcdoc='${codigo}' style='width:100%;height:100%;border:none;'></iframe>`;
  } else {
    previewContainer.innerHTML = `<pre style="color:#00ff66;padding:10px;font-family:'JetBrains Mono';">${codigo}</pre>`;
  }
}

// CONFIRMAR = JOGA SANDBOX PRA REPO REAL
document.getElementById('confirmarBtn').onclick = () => {
  KORVIL_REPO[ARQUIVO_SELECIONADO] = SANDBOX[ARQUIVO_SELECIONADO];
  PENDENTE_COMMIT = false;
  falarKai(`Confirmado! ${ARQUIVO_SELECIONADO} salvo no repositório real.`);
  alert(`CONFIRMADO! ${ARQUIVO_SELECIONADO} salvo.`);
}

// ABAS
document.querySelectorAll('.aba').forEach(aba=>{
  aba.onclick = () => {
    document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
    aba.classList.add('ativa');
    const tipo = aba.dataset.aba;
    document.getElementById('forja-app').style.display = tipo==='editor'?'flex':'none';
    document.getElementById('repo-explorer').style.display = tipo==='repo'?'block':'none';
    document.getElementById('kai-painel').style.display = tipo==='kai'?'block':'none';
    document.getElementById('historico').style.display = tipo==='historico'?'block':'none';
  }
});

// BOTÕES TOPO
document.getElementById('btnNovo').onclick = () => {
  let nome = prompt("Nome do novo arquivo:", "novo.html");
  if(nome){
    SANDBOX[nome] = "";
    carregarSelect('arquivo', Object.keys(SANDBOX));
    document.getElementById('arquivo').value = nome;
    ARQUIVO_SELECIONADO = nome;
    editor.value = "";
    falarKai(`Novo arquivo ${nome} criado no sandbox.`);
  }
}
document.getElementById('btnExportar').onclick = () => {
  let conteudo = SANDBOX[ARQUIVO_SELECIONADO];
  let blob = new Blob([conteudo], {type: 'text/plain'});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = ARQUIVO_SELECIONADO;
  a.click();
}
document.getElementById('btnSalvar').onclick = () => document.getElementById('confirmarBtn').click();

// COMANDO UNIFICADO + VOZ
let recognition;
if('webkitSpeechRecognition' in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.onresult = e => {
    let texto = e.results[0][0].transcript;
    document.getElementById('comandoUnificado').value = texto;
    processarComandoUnificado(texto);
  }
}
document.getElementById('btnVoz').onclick = () => {
  document.getElementById('btnVoz').classList.add('gravando');
  recognition.start();
  setTimeout(()=>document.getElementById('btnVoz').classList.remove('gravando'),3000);
}
document.getElementById('btnExecutarComando').onclick = () => {
  processarComandoUnificado(document.getElementById('comandoUnificado').value);
}

function processarComandoUnificado(texto){
  texto = texto.toLowerCase();
  falarKai(`Processando: ${texto}`);

  if(texto.includes('setor')) setarValor('setor', extrair(texto,'setor'));
  if(texto.includes('area')) setarValor('area', extrair(texto,'area'));
  if(texto.includes('servico')) setarValor('servico', extrair(texto,'servico'));
  if(texto.includes('arquivo')) setarValor('arquivo', extrair(texto,'arquivo'));

  K_AI.salvarMemoria(`Comando executado: ${texto}`);
}

function extrair(texto, palavra){
  let partes = texto.split(palavra);
  if(partes[1]) return partes[1].split(' ')[1];
  return "";
}
function setarValor(id, valor){
  let select = document.getElementById(id);
  if(valor && select){
    select.value = valor;
    document.querySelector(`.slot[data-tipo=${id}]`).textContent = `${id.toUpperCase()}: ${valor}`;
    document.querySelector(`.slot[data-tipo=${id}]`).classList.add('preenchido');
  }
}

// PEÇAS + DRAG
function carregarPecasRapidas(){
  const zona = document.getElementById('pecas-rapidas');
  zona.innerHTML = '';
  [...dadosForja.setores,...dadosForja.areas,...dadosForja.servicos].slice(0,15).forEach(nome=>{
    const peca = document.createElement('div');
    peca.className = 'peca'; peca.draggable = true; peca.textContent = nome;
    peca.ondragstart = e => e.dataTransfer.setData('text', nome);
    zona.appendChild(peca);
  });
}
carregarPecasRapidas();

document.querySelectorAll('.slot').forEach(slot=>{
  slot.ondragover = e => e.preventDefault();
  slot.ondrop = e => {
    e.preventDefault();
    const valor = e.dataTransfer.getData('text');
    slot.textContent = `${slot.dataset.tipo}: ${valor}`;
    slot.classList.add('preenchido');
    setarValor(slot.dataset.tipo, valor);
    falarKai(`Adicionado ${valor}`);
  }
});

// CGM - CONTROLE POR GESTOS
let cgmAtivo = false; let hands, camera;
let mouseVirtual = document.createElement('div');
mouseVirtual.id = 'mouse-virtual';
document.body.appendChild(mouseVirtual);

function iniciarCGM(){
  cgmAtivo = true;
  document.getElementById('canvasCGM').style.display = 'block';
  document.getElementById('statusCGM').style.display = 'block';
  document.getElementById('status-cgm').textContent = 'CGM ATIVO';

  hands = new Hands({locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
  hands.setOptions({maxNumHands: 2});
  hands.onResults(results=>{
    if(results.multiHandLandmarks){
      let x = results.multiHandLandmarks[0][8].x * window.innerWidth;
      let y = results.multiHandLandmarks[0][8].y * window.innerHeight;
      mouseVirtual.style.left = x-15 + 'px';
      mouseVirtual.style.top = y-15 + 'px';
    }
  });
  camera = new Camera(document.getElementById('videoCGM'), {
    onFrame: async () => await hands.send({image: document.getElementById('videoCGM')}),
    width: 640, height: 480
  });
  camera.start();
  falarKai("CGM Ativado");
}
function pararCGM(){
  cgmAtivo=false;
  document.getElementById('canvasCGM').style.display='none';
  document.getElementById('statusCGM').style.display='none';
  document.getElementById('status-cgm').textContent = 'CGM OFF';
  camera.stop();
}
document.getElementById('ativarCGMBTN').onclick = () => cgmAtivo? pararCGM() : iniciarCGM();

// K-AI CUBO
const cubo = document.getElementById('cubo-kai');
const menuKai = document.getElementById('menu-kai');
cubo.onclick = () => menuKai.classList.toggle('ativo');

function falarKai(texto){
  document.getElementById('respostaKai').innerHTML = `K-AI: ${texto}`;
  document.getElementById('kai-memorias').innerHTML += `<p>> ${texto}</p>`;
}

document.getElementById('ativarKaiBtn').onclick = () => {
  K_AI.ativo =!K_AI.ativo;
  falarKai(K_AI.ativo? 'K-AI ATIVADO' : 'K-AI DESATIVADO');
  document.getElementById('status-kai').textContent = K_AI.ativo? 'K-AI ATIVO' : 'K-AI OFF';
}

// INICIAR
atualizarPreview();
 = () => falarKai("Sugestão: Use mais comentários no código.");
