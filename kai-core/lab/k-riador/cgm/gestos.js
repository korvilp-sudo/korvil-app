// ===== KORVIL G15 ULTRA 5.2 JS - FOTO TRAVADA =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;let vozLigada=true;
function initAudio(){if(!audioCtx)audioCtx=new AudioContext();}
function playSound(f,t='sine',d=0.1,v=0.1){if(!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.setValueAtTime(f,audioCtx.currentTime);g.gain.setValueAtTime(v,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+d);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d);}catch(e){}}
const SFX={click:()=>playSound(800,'square',0.05,0.08),grab:()=>playSound(300,'sawtooth',0.12,0.08),trash:()=>playSound(150,'sawtooth',0.25,0.12),spawn:()=>{playSound(600,'sine',0.1,0.1);setTimeout(()=>playSound(900,'sine',0.1,0.08),50);},action:()=>playSound(1000,'sine',0.15,0.06)};
const falas=window.speechSynthesis;function falar(texto){if(!vozLigada)return;falas.cancel();let msg=new SpeechSynthesisUtterance(texto);msg.lang='pt-BR';msg.rate=1.1;falas.speak(msg);}

// ESTADO
let cubos=[],segurado=null;
let cores=['#00f0ff','#ff00ea','#ffe600','#00ff66','#ff3366'];let corAtual=0;
let posSuave={x:-100,y:-100,cx:-100,cy:-100},sensibilidade=1.0;
let tempoPunhoInicio=null,punhoTravado=false,cooldownGesto=0;

// NOVO ESTADO FOTO TRAVADA
let fotos=[],pincaTimer=null,contagemAtiva=false,contador=10;
let modoFotoTravado=false; // TRAVA TUDO DEPOIS DA FOTO
let fotoPendente=null; // Foto que acabou de tirar

// FUNÇÕES BASE
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function isPinca(h){return dist(h[4],h[8])<0.06;}
function isMaoFechada(h){return dist(h[8],h[5])<0.12&&dist(h[12],h[9])<0.12;}
function isMaoAberta(h){return dist(h[8],h[0])>0.32&&dist(h[12],h[0])>0.32;}
function identificarGesto(h){if(isPinca(h))return"PINÇA";if(isMaoFechada(h))return"PUNHO";if(isMaoAberta(h))return"ABERTO";if(h[8].y<h[6].y&&h[12].y<h[10].y)return"PAZ";if(h[8].y<h[6].y)return"APONTAR";if(h[4].y<h[3].y)return"LIKE";if(h[4].y>h[2].y)return"DISLIKE";if(h[8].y<h[6].y&&h[20].y<h[18].y)return"ROCK";return"NEUTRO";}

// CRIAR CUBO + MOUSE
function criarCubo(x,y){
  if(modoFotoTravado)return; // BLOQUEIA SE ESTIVER NO MODO FOTO
  initAudio();
  const c=document.createElement('div');c.className='cubo';
  c.style.left=(x||window.innerWidth/2-45)+'px';c.style.top=(y||window.innerHeight/2-45)+'px';
  c.style.borderColor=cores[corAtual];c.style.background=cores[corAtual]+'22';

  let isDragging=false,offsetX=0,offsetY=0;
  c.addEventListener('pointerdown',e=>{if(modoFotoTravado)return;initAudio();isDragging=true;offsetX=e.clientX-c.offsetLeft;offsetY=e.clientY-c.offsetTop;c.classList.add('segurado');SFX.grab();c.setPointerCapture(e.pointerId);});
  c.addEventListener('pointermove',e=>{if(!isDragging||modoFotoTravado)return;c.style.left=`${e.clientX-offsetX}px`;c.style.top=`${e.clientY-offsetY}px`;});
  c.addEventListener('pointerup',e=>{
    if(modoFotoTravado)return;
    isDragging=false;c.classList.remove('segurado');
    const lixRect=document.getElementById('lixeira').getBoundingClientRect();
    const distLixo=Math.hypot(e.clientX-(lixRect.left+lixRect.width/2),e.clientY-(lixRect.top+lixRect.height/2));
    if(distLixo<90){SFX.trash();c.remove();cubos=cubos.filter(item=>item!==c);document.getElementById('st-obj').textContent=cubos.length;}
  });
  document.body.appendChild(c);cubos.push(c);document.getElementById('st-obj').textContent=cubos.length;SFX.spawn();
}

// FOTO NOVA COM TRAVA
function tirarFoto(){
  if(contagemAtiva||modoFotoTravado)return;
  contagemAtiva=true;contador=10;
  document.getElementById('contador').style.display='block';
  document.getElementById('st-feedback').textContent="CONTAGEM 10s";
  falar("Foto em 10 segundos");

  const interval=setInterval(()=>{
    document.getElementById('contador').innerText=contador;
    if(contador<=3)falar(contador.toString());
    contador--;
    if(contador<0){
      clearInterval(interval);
      capturarFrame();
      document.getElementById('contador').style.display='none';
      contagemAtiva=false;
      ativarModoFotoTravado(); // ATIVA A TRAVA AQUI
    }
  },1000);
}

function capturarFrame(){
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;
  const ctx=canvas.getContext('2d');ctx.drawImage(document.getElementById('video'),0,0,640,480);
  document.getElementById('flash').style.opacity='0.8';setTimeout(()=>document.getElementById('flash').style.opacity='0',200);
  const dataURL=canvas.toDataURL('image/png');
  fotoPendente={id:Date.now(),src:dataURL}; // GUARDA A FOTO PENDENTE
  falar("Foto capturada. Passe para esquerda para excluir ou direita para salvar");
}

function ativarModoFotoTravado(){
  modoFotoTravado=true;
  document.getElementById('st-text').textContent="MODO FOTO ATIVO";
  document.getElementById('st-feedback').textContent="ESQUERDA=EXCLUIR | DIREITA=SALVAR";
  document.getElementById('tutorial-box').innerHTML="📸 <b>FOTO PRONTA!</b><br>👈 Passe a mão pra LIXEIRA<br>👉 Passe a mão pra SALVAR";
  document.getElementById('lixeira').style.borderColor="#ff0044";
  document.getElementById('zonaSalvar').style.borderColor="#00ff66";
}

function sairModoFotoTravado(){
  modoFotoTravado=false;
  fotoPendente=null;
  document.getElementById('st-text').textContent="SISTEMA NORMAL";
  document.getElementById('st-feedback').textContent="PRONTO";
  document.getElementById('tutorial-box').innerHTML="💡 <b>COACH ATIVO</b><br>Segure PINÇA 2s para tirar foto";
  document.getElementById('lixeira').style.borderColor="#ff3366";
  document.getElementById('zonaSalvar').style.borderColor="#00ff66";
}

function salvarFotoPendente(){
  if(!fotoPendente)return;
  const a=document.createElement('a');a.href=fotoPendente.src;a.download=`KORVIL-FOTO-${fotoPendente.id}.png`;a.click();
  adicionarNaGaleria(fotoPendente);
  falar("Foto salva com sucesso");
  SFX.click();
  sairModoFotoTravado();
}

function deletarFotoPendente(){
  falar("Foto excluída");
  SFX.trash();
  sairModoFotoTravado();
}

function adicionarNaGaleria(foto){
  fotos.push(foto);
  let img=document.createElement('img');img.src=foto.src;img.className='foto-mini';
  document.getElementById('galeria').prepend(img);
}

// 21 AÇÕES - BLOQUEADAS NO MODO FOTO
function executarAcao(g1,g2){
  if(modoFotoTravado)return; // BLOQUEIA TODAS AS AÇÕES DURANTE O MODO FOTO
  if(Date.now()<cooldownGesto)return;cooldownGesto=Date.now()+800;
  const combo=g2==="NEUTRO"?g1:g1+" "+g2;
  const acoes={"PINÇA":()=>criarCubo(posSuave.x,posSuave.y),"LIKE":()=>document.getElementById('cor').click(),"DISLIKE":()=>{if(cubos.length){cubos.pop().remove();document.getElementById('st-obj').textContent=cubos.length;}},"ABERTO ABERTO":()=>document.getElementById('limpar').click(),"PUNHO PUNHO":()=>cubos.forEach((c,i)=>{c.style.left=window.innerWidth/2-45+'px';c.style.top=window.innerHeight/2-45+i*20+'px'}),"LIKE LIKE":()=>cubos.forEach(c=>c.style.transform='scale(1.5)'),"DISLIKE DISLIKE":()=>cubos.forEach(c=>c.style.transform='scale(0.7)'),"PAZ PAZ":()=>criarCubo(),"APONTAR APONTAR":()=>document.getElementById('cursor').style.borderColor="#ff00ea"};
  if(acoes[combo]){document.getElementById('st-acao').textContent=combo;falar("Ação: "+combo);SFX.action();acoes[combo]();}
}

// MEDIAPIPE
const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.6,minTrackingConfidence:0.6});

hands.onResults(res=>{
  const maos=res.multiHandLandmarks;
  if(maos&&maos.length>0){
    document.getElementById('st-text').textContent=maos.length===2?"2 MÃOS":"1 MÃO";
    const h1=maos[0];
    let tx=(1-h1[8].x)*window.innerWidth,ty=h1[8].y*window.innerHeight;
    posSuave.x+=(tx-posSuave.x)*0.4;posSuave.y+=(ty-posSuave.y)*0.4;
    document.getElementById('pino1').style.left=posSuave.x+'px';document.getElementById('pino1').style.top=posSuave.y+'px';
    const gesto1=identificarGesto(h1);document.getElementById('st-gesto').textContent=gesto1;

    // AÇÃO 21: PINÇA 2s
    if(gesto1==="PINÇA"&&!pincaTimer&&!modoFotoTravado){pincaTimer=setTimeout(()=>tirarFoto(),2000);document.getElementById('st-feedback').textContent="SEGURE PINÇA 2s...";}
    if(gesto1!=="PINÇA"&&pincaTimer){clearTimeout(pincaTimer);pincaTimer=null;}

    // NOVO: DETECTAR SWIPE NO MODO FOTO TRAVADO
    if(modoFotoTravado){
      const lixRect=document.getElementById('lixeira').getBoundingClientRect();
      const saveRect=document.getElementById('zonaSalvar').getBoundingClientRect();

      if(posSuave.x < lixRect.right + 50){ // PERTO DA LIXEIRA = ESQUERDA
        document.getElementById('lixeira').classList.add('ativo');
        setTimeout(()=>{deletarFotoPendente();document.getElementById('lixeira').classList.remove('ativo');},300);
      }
      if(posSuave.x > saveRect.left - 50){ // PERTO DO SALVAR = DIREITA
        document.getElementById('zonaSalvar').classList.add('ativo');
        setTimeout(()=>{salvarFotoPendente();document.getElementById('zonaSalvar').classList.remove('ativo');},300);
      }
    }

    if(maos.length>1){const h2=maos[1];const gesto2=identificarGesto(h2);executarAcao(gesto1,gesto2);}else{executarAcao(gesto1,"NEUTRO");}
  }
});

// BOTÕES
document.getElementById('novo').onclick=()=>criarCubo();
document.getElementById('limpar').onclick=()=>{if(modoFotoTravado)return;cubos.forEach(c=>c.remove());cubos=[];document.getElementById('st-obj').textContent=0;};
document.getElementById('cor').onclick=()=>{if(modoFotoTravado)return;corAtual=(corAtual+1)%cores.length;document.getElementById('cor').style.color=cores[corAtual];};
document.getElementById('voz').onclick=()=>{vozLigada=!vozLigada;document.getElementById('voz').innerText=vozLigada?'🔊 VOZ: LIGADA':'🔇 VOZ: DESLIGADA';};
document.getElementById('calibrar').onclick=()=>{falar("Calibrado");document.getElementById('calibFill').style.width='100%';};

const camera=new Camera(document.getElementById('video'),{onFrame:async()=>{await hands.send({image:document.getElementById('video')});},width:640,height:480});
camera.start();
criarCubo();
falar("Sistema iniciado");
