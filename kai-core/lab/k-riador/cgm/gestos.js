// ===== SISTEMA DE VOZ + SFX =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let vozLigada = true;
function initAudio(){if(!audioCtx)audioCtx=new AudioContext();}
function playSound(f,t='sine',d=0.1,v=0.1){if(!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.setValueAtTime(f,audioCtx.currentTime);g.gain.setValueAtTime(v,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+d);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d);}catch(e){}}
const SFX={click:()=>playSound(800,'square',0.05,0.08),grab:()=>playSound(300,'sawtooth',0.12,0.08),trash:()=>playSound(150,'sawtooth',0.25,0.12),spawn:()=>{playSound(600,'sine',0.1,0.1);setTimeout(()=>playSound(900,'sine',0.1,0.08),50);},action:()=>playSound(1000,'sine',0.15,0.06),erro:()=>{playSound(200,'sawtooth',0.3,0.15);setTimeout(()=>playSound(150,'sawtooth',0.3,0.15),150)},sucesso:()=>{playSound(1200,'sine',0.1,0.1);setTimeout(()=>playSound(1500,'sine',0.1,0.08),100)}};
const falas=window.speechSynthesis;
function falar(texto,tipo='info'){if(!vozLigada)return;falas.cancel();let msg=new SpeechSynthesisUtterance(texto);msg.lang='pt-BR';msg.rate=1.1;msg.pitch=tipo==='erro'?0.8:tipo==='sucesso'?1.3:1.1;falas.speak(msg);}

// ===== ESTADO GERAL =====
let cubos=[],segurado=null,redimensionando=null;
let cores=['#00f0ff','#ff00ea','#ffe600','#00ff66','#ff3366'];let corAtual=0;
let posSuave={x:-100,y:-100,cx:-100,cy:-100},sensibilidade=1.0;
let tempoPunhoInicio=null,punhoTravado=false,cooldownGesto=0,calibrado=false,calibValues={pinca:0.06,abrir:0.32};
let ultimoErro='',ultimoAcerto='';

// ===== NOVO ESTADO FOTO =====
let fotos = [];
let fotoAtual = null;
let pincaTimer = null;
let contagemAtiva = false;
let contador = 10;
let swipeInicio = {x:0, y:0, tempo:0, id:null};

// ===== CALIBRAGEM =====
function calibrarMao(h){
  let pinca=dist(h[4],h[8]),abrir=dist(h[8],h[0]);
  calibValues.pinca=pinca*0.9; calibValues.abrir=abrir*1.1;
  document.getElementById('calibFill').style.width='100%'; calibrado=true; SFX.sucesso();
  falar("Calibragem concluída com sucesso. Sistema pronto para uso", 'sucesso');
  document.getElementById('st-text').textContent="CALIBRADO";
  document.getElementById('tutorial-box').innerHTML="✅ <b>CALIBRAÇÃO OK!</b><br>Segure PINÇA 2s para tirar foto";
}

// ===== FUNÇÕES FOTO =====
function tirarFoto() {
  if (contagemAtiva) return;
  contagemAtiva = true; contador = 10;
  document.getElementById('contador').style.display = 'block';
  falar("Foto em 10 segundos", 'sucesso');

  const interval = setInterval(() => {
    document.getElementById('contador').innerText = contador;
    if(contador<=3)falar(contador.toString());
    contador--;
    if (contador < 0) {
      clearInterval(interval);
      capturarFrame();
      document.getElementById('contador').style.display = 'none';
      contagemAtiva = false;
    }
  }, 1000);
}

function capturarFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(document.getElementById('video'), 0, 0, 640, 480);
  document.getElementById('flash').style.opacity = '0.8';
  setTimeout(() => document.getElementById('flash').style.opacity = '0', 200);
  const dataURL = canvas.toDataURL('image/png');
  fotoAtual = {id: Date.now(), src: dataURL};
  adicionarNaGaleria(fotoAtual);
  falar("Foto capturada", 'sucesso'); SFX.sucesso();
}

function adicionarNaGaleria(foto) {
  fotos.push(foto);
  const img = document.createElement('img');
  img.src = foto.src; img.className = 'foto-mini'; img.dataset.id = foto.id;
  document.getElementById('galeria').prepend(img);
}

function salvarFoto(foto) {
  const a = document.createElement('a');
  a.href = foto.src; a.download = `KORVIL-FOTO-${foto.id}.png`;
  a.click(); falar("Foto salva na pasta Downloads"); SFX.click();
}

function deletarFoto(fotoId) {
  fotos = fotos.filter(f => f.id!= fotoId);
  const el = document.querySelector(`.foto-mini[data-id="${fotoId}"]`);
  if(el)el.remove(); falar("Foto excluída"); SFX.trash();
}

// ===== DETECÇÃO =====
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function isPinca(h){return dist(h[4],h[8])<calibValues.pinca;}
function isMaoFechada(h){return dist(h[8],h[5])<0.12&&dist(h[12],h[9])<0.12&&dist(h[16],h[13])<0.12&&dist(h[20],h[17])<0.12;}
function isMaoAberta(h){return dist(h[8],h[0])>calibValues.abrir&&dist(h[12],h[0])>calibValues.abrir;}
function identificarGesto(h){
  if(isPinca(h))return"PINÇA";
  if(isMaoFechada(h))return"PUNHO";
  if(isMaoAberta(h))return"ABERTO";
  if(h[8].y<h[6].y&&h[12].y<h[10].y&&h[16].y>h[14].y)return"PAZ";
  if(h[8].y<h[6].y&&h[12].y>h[10].y)return"APONTAR";
  if(h[4].y<h[3].y&&h[8].y>h[6].y)return"LIKE";
  if(h[4].y>h[2].y)return"DISLIKE";
  if(h[8].y<h[6].y&&h[20].y<h[18].y)return"ROCK";
  return"NEUTRO";
}

// ===== 21 AÇÕES COM VOZ =====
function executarAcao(g1,g2){
  if(Date.now()<cooldownGesto)return; cooldownGesto=Date.now()+1200;
  const acoes={
    1:["PINÇA + NEUTRO","CRIAR CUBO",()=>criarCubo(),"Junte dedão com indicador"],
    2:["LIKE + NEUTRO","TROCAR COR",()=>document.getElementById('cor').click(),"Faça joinha"],
    3:["DISLIKE + NEUTRO","APAGAR ÚLTIMO",()=>{if(cubos.length){cubos.pop().remove();document.getElementById('st-obj').textContent=cubos.length;SFX.trash()}},"Polegar para baixo"],
    4:["ROCK + NEUTRO","EFEITO GLITCH",()=>{document.body.style.filter="hue-rotate(180deg)";setTimeout(()=>document.body.style.filter="none",800)},"Sinal de rock"],
    5:["ABERTO + ABERTO","LIMPAR TUDO",()=>document.getElementById('limpar').click(),"Duas mãos abertas"],
    6:["PUNHO + PUNHO","AGRUPAR CENTRO",()=>cubos.forEach((c,i)=>{c.style.left=window.innerWidth/2-45+i*15+'px';c.style.top=window.innerHeight/2-45+'px'}),"Dois punhos"],
    7:["LIKE + LIKE","AUMENTAR TODOS",()=>cubos.forEach(c=>{let s=Math.min(3,parseFloat(c.dataset.scale||1)+0.3);c.dataset.scale=s;c.style.transform=`scale(${s})`})),"Dois joinhas"],
    8:["DISLIKE + DISLIKE","DIMINUIR TODOS",()=>cubos.forEach(c=>{let s=Math.max(0.4,parseFloat(c.dataset.scale||1)-0.3);c.dataset.scale=s;c.style.transform=`scale(${s})`})),"Dois dislikes"],
    9:["PAZ + PAZ","DUPLICAR",()=>{if(cubos.length<12)criarCubo(window.innerWidth/2+Math.random()*100,window.innerHeight/2)},"Duas paz e amor"],
    10:["APONTAR + APONTAR","MODO MIRA",()=>{document.getElementById('cursor').style.borderColor="#ff00ea";setTimeout(()=>document.getElementById('cursor').style.borderColor="#00f0ff",1500)},"Dois dedos apontando"],
    11:["ROCK + ROCK","PULSO SONORO",()=>playSound(1500,'sawtooth',0.4,0.2),"Dois sinais de rock"],
    12:["PUNHO + LIKE","MODO MATRIX",()=>{document.body.style.background="#001a05";setTimeout(()=>document.body.style.background="#030712",2000)},"Punho e joinha"],
    13:["ABERTO + APONTAR","SNAP GRID",()=>cubos.forEach(c=>{c.style.left=Math.round(c.offsetLeft/50)*50+'px';c.style.top=Math.round(c.offsetTop/50)*50+'px'})),"Mão aberta e apontar"],
    14:["PAZ + APONTAR","MUTE AUDIO",()=>{audioCtx=audioCtx?null:new AudioContext();vozLigada=!vozLigada;document.getElementById('voz').innerText=vozLigada?'🔊 VOZ: LIGADA':'🔇 VOZ: DESLIGADA'},"Paz e apontar"],
    15:["LIKE + APONTAR","COR ALEATÓRIA",()=>{corAtual=Math.floor(Math.random()*cores.length);document.getElementById('cor').style.color=cores[corAtual]},"Like e apontar"],
    16:["ROCK + LIKE","ROTACIONAR 45°",()=>cubos.forEach(c=>{let r=(parseFloat(c.dataset.rotate||0)+45)%360;c.dataset.rotate=r;c.style.transform=`scale(${c.dataset.scale||1}) rotate(${r}deg)`})),"Rock e like"],
    17:["PUNHO + PAZ","ESPALHAR",()=>cubos.forEach(c=>{c.style.left=Math.random()*(window.innerWidth-100)+'px';c.style.top=Math.random()*(window.innerHeight-100)+'px'})),"Punho e paz"],
    18:["ABERTO + ROCK","BASS BOOST",()=>playSound(80,'sine',0.6,0.15),"Mão aberta e rock"],
    19:["DISLIKE + LIKE","INVERTER TAMANHO",()=>cubos.forEach(c=>{let s=parseFloat(c.dataset.scale||1)>1?0.6:1.8;c.dataset.scale=s;c.style.transform=`scale(${s})`})),"Dislike e like"],
    20:["APONTAR + ROCK","AUMENTAR SENS",()=>{sensibilidade=Math.min(3,sensibilidade+0.2)},"Apontar e rock"],
    21:["PINÇA + NEUTRO 2S","TIRAR FOTO",()=>tirarFoto(),"Segure pinça 2 segundos"]
  };

  let achou=false;
  for(let i=1;i<=21;i++){
    if(acoes[i][0].includes(g1) && acoes[i][0].includes(g2) || acoes[i][0].includes(g2) && acoes[i][0].includes(g1)){
      if(ultimoAcerto!==i && i!==21){
        document.getElementById('st-acao').textContent=`[AÇÃO ${i}] ${acoes[i][1]}`;
        document.getElementById('st-feedback').textContent="AÇÃO EXECUTADA"; document.getElementById('st-feedback').className="sucesso";
        document.getElementById('tutorial-box').innerHTML=`✅ <b>AÇÃO ${i}: ${acoes[i][1]}</b><br>${acoes[i][3]}`;
        falar(`Ação ${i} executada: ${acoes[i][1]}`, 'sucesso');
        SFX.action(); acoes[i][2](); ultimoAcerto=i; ultimoErro='';
      }
      return;
    }
  }
  if(g1!=="NEUTRO"&&ultimoErro!==g1){
    document.getElementById('st-feedback').textContent="GESTO INVÁLIDO"; document.getElementById('st-feedback').className="erro";
    falar("Gesto não reconhecido. Tente novamente", 'erro'); SFX.erro(); ultimoErro=g1;
  }
}

// ===== LOOP PRINCIPAL MEDIAPIPE =====
const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.6,minTrackingConfidence:0.6});

hands.onResults(res=>{
  const maos=res.multiHandLandmarks;
  if(maos&&maos.length>0){
    document.getElementById('st-text').textContent=maos.length===2?"2 MÃOS DETECTADAS":"1 MÃO DETECTADA";
    const h1=maos[0];
    let tx=(1-h1[8].x)*window.innerWidth,ty=h1[8].y*window.innerHeight;
    posSuave.x+= (tx-posSuave.x)*0.4*sensibilidade;
    posSuave.y+= (ty-posSuave.y)*0.4*sensibilidade;
    document.getElementById('pino1').style.left=posSuave.x+'px'; document.getElementById('pino1').style.top=posSuave.y+'px';
    const gesto1=identificarGesto(h1);
    document.getElementById('st-gesto').textContent=gesto1;

    // AÇÃO 21: PINÇA 2s = FOTO
    if(gesto1==="PINÇA"&&!pincaTimer&&!contagemAtiva){
      pincaTimer=setTimeout(()=>tirarFoto(),2000);
      document.getElementById('st-feedback').textContent="SEGURE PINÇA 2s...";
      falar("Segure para tirar foto");
    }
    if(gesto1!=="PINÇA"&&pincaTimer){clearTimeout(pincaTimer);pincaTimer=null;}

    // SWIPE NA GALERIA
    document.querySelectorAll('.foto-mini').forEach(img=>{
      const rect=img.getBoundingClientRect();
      if(posSuave.x>rect.left&&posSuave.x<rect.right&&posSuave.y>rect.top&&posSuave.y<rect.bottom){
        if(!swipeInicio.tempo){swipeInicio={x:posSuave.x,y:posSuave.y,tempo:Date.now(),id:img.dataset.id};}
        else{
          let dx=posSuave.x-swipeInicio.x,dt=Date.now()-swipeInicio.tempo;
          if(dt<500&&Math.abs(dx)>80){
            if(dx<-80){document.getElementById('zonaLixeira').classList.add('ativo');deletarFoto(swipeInicio.id);}
            if(dx>80){document.getElementById('zonaSalvar').classList.add('ativo');const foto=fotos.find(f=>f.id==swipeInicio.id);if(foto)salvarFoto(foto);}
            setTimeout(()=>{document.getElementById('zonaLixeira').classList.remove('ativo');document.getElementById('zonaSalvar').classList.remove('ativo');},300);
            swipeInicio={x:0,y:0,tempo:0};
          }
        }
      }
    });

    if(!calibrado){
      if(gesto1==="ABERTO"){calibrarMao(h1);}
      else{document.getElementById('tutorial-box').innerHTML="⚠️ <b>PRECISA CALIBRAR</b><br>Abra a mão completamente"; falar("Abra a mão para calibrar", 'erro');}
      return;
    }

    if(gesto1==="PUNHO"){if(!tempoPunhoInicio)tempoPunhoInicio=Date.now();else{document.getElementById('fist-progress').style.width=Math.min(100,(Date.now()-tempoPunhoInicio)/20)+'%';if(Date.now()-tempoPunhoInicio>2000&&!punhoTravado){punhoTravado=true;falar("Objeto travado. Mova para arrastar", 'sucesso');}}}
    else{tempoPunhoInicio=null;document.getElementById('fist-progress').style.width='0%';if(punhoTravado){punhoTravado=false;if(segurado){segurado.classList.remove('segurado');segurado=null;falar("Objeto solto");}}}

    if((gesto1==="PINÇA"||punhoTravado)&&!segurado){cubos.forEach(c=>{let r=c.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;if(Math.hypot(posSuave.x-cx,posSuave.y-cy)<120){segurado=c;SFX.grab();falar("Objeto capturado");}});}
    if(segurado){segurado.classList.add('segurado');segurado.style.left=posSuave.x-segurado.offsetWidth/2+'px';segurado.style.top=posSuave.y-segurado.offsetHeight/2+'px';}
    if(gesto1!=="PINÇA"&&!punhoTravado&&segurado){segurado.classList.remove('segurado');segurado=null;}

    if(maos.length>1){
      const h2=maos[1];
      let tx2=(1-h2[8].x)*window.innerWidth,ty2=h2[8].y*window.innerHeight;
      posSuave.cx+=(tx2-posSuave.cx)*0.4*sensibilidade;posSuave.cy+=(ty2-posSuave.cy)*0.4*sensibilidade;
      document.getElementById('pino2').style.left=posSuave.cx+'px';document.getElementById('pino2').style.top=posSuave.cy+'px';
      document.getElementById('cursor').style.left=posSuave.cx+'px';document.getElementById('cursor').style.top=posSuave.cy+'px';
      const gesto2=identificarGesto(h2);document.getElementById('st-gesto').textContent=`${gesto1} + ${gesto2}`;
      executarAcao(gesto1,gesto2);
    }else{executarAcao(gesto1,"NEUTRO");}

  }else{
    document.getElementById('st-text').textContent="AGUARDANDO MÃOS...";
    document.getElementById('st-gesto').textContent="NENHUM";
    if(pincaTimer){clearTimeout(pincaTimer);pincaTimer=null;}
    swipeInicio={x:0,y:0,tempo:0};
  }
});

// ===== CUBOS E BOTÕES =====
function criarCubo(x,y){
  initAudio();const c=document.createElement('div');c.className='cubo';
  c.style.left=(x||window.innerWidth/2-45)+'px';c.style.top=(y||window.innerHeight/2-45)+'px';
  c.style.borderColor=cores[corAtual];c.style.background=cores[corAtual]+'22';
  document.body.appendChild(c);cubos.push(c);document.getElementById('st-obj').textContent=cubos.length;SFX.spawn();
}
document.getElementById('novo').onclick=()=>{criarCubo();falar("Novo cubo criado");};
document.getElementById('limpar').onclick=()=>{SFX.trash();cubos.forEach(c=>c.remove());cubos=[];document.getElementById('st-obj').textContent=0;falar("Todos os objetos removidos");};
document.getElementById('cor').onclick=()=>{SFX.click();corAtual=(corAtual+1)%cores.length;document.getElementById('cor').style.color=cores[corAtual];falar("Cor alterada");};
document.getElementById('calibrar').onclick=()=>{calibrado=false;document.getElementById('calibFill').style.width='0%';document.getElementById('st-text').textContent="MOSTRE MÃO ABERTA";falar("Mostre a mão aberta para calibrar");};
document.getElementById('voz').onclick=()=>{vozLigada=!vozLigada;document.getElementById('voz').innerText=vozLigada?'🔊 VOZ: LIGADA':'🔇 VOZ: DESLIGADA';falar(vozLigada?'Voz ativada':'Voz desativada');};

const camera=new Camera(document.getElementById('video'),{onFrame:async()=>{await hands.send({image:document.getElementById('video')});},width:640,height:480});
camera.start().then(()=>falar("Sistema iniciado. Mostre a mão aberta para calibrar"));
criarCubo();
