<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>KORVIL G15</title>
<style>
* {box-sizing: border-box;margin: 0;padding: 0;touch-action: none;user-select: none;font-family: 'Courier New', Courier, monospace;}
body {background: #030712;color: #00f0ff;overflow: hidden;width: 100vw;height: 100vh;}
.grid-bg {position: absolute;inset: 0;background-image: linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);background-size: 30px 30px;pointer-events: none;z-index: 1;}
.scanlines {position: absolute;inset: 0;background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);background-size: 100% 4px;pointer-events: none;z-index: 2;}
#video {position: absolute;width: 100%;height: 100%;object-fit: cover;transform: scaleX(-1);opacity: 0.18;filter: grayscale(80%) contrast(150%);}

#menu {position: absolute;top: 15px;left: 15px;width: 220px;background: rgba(5, 12, 24, 0.95);border: 2px solid #00f0ff;box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);padding: 12px;border-radius: 8px;backdrop-filter: blur(8px);z-index: 10;}
.menu-title {font-size: 12px;font-weight: bold;letter-spacing: 1px;margin-bottom: 10px;text-shadow: 0 0 8px #00f0ff;display: flex;justify-content: space-between;color:#ffe600;}
.btn {width: 100%;padding: 10px;margin: 4px 0;background: rgba(0, 240, 255, 0.1);border: 1px solid #00f0ff;color: #00f0ff;font-size: 11px;font-weight: bold;letter-spacing: 1px;cursor: pointer;border-radius: 5px;transition: all 0.15s ease;text-align: left;}
.btn:hover {border-color: #ffffff;box-shadow: 0 0 15px #00f0ff;background: rgba(0, 240, 255, 0.4);color: #fff;transform:translateX(5px);}

.cubo {position: absolute;width: 90px;height: 90px;border: 3px solid #00f0ff;background: rgba(0, 240, 255, 0.15);box-shadow: 0 0 20px rgba(0, 240, 255, 0.6);border-radius: 8px;cursor: grab;z-index: 5;display: flex;align-items: center;justify-content: center;font-size: 11px;}
.cubo::after {content: 'K-AI';opacity: 0.6;font-size: 10px;}
.cubo.segurado {border-color: #ff00ea;background: rgba(255, 0, 234, 0.3);box-shadow: 0 0 35px #ff00ea;transform:scale(1.1);z-index:8;}

#lixeira {position: absolute;bottom: 20px;left: 20px;width: 70px;height: 70px;border: 3px dashed #ff3366;border-radius: 12px;background: rgba(255, 51, 102, 0.15);display: flex;align-items: center;justify-content: center;font-size: 28px;z-index: 10;transition: all 0.2s ease;}
#lixeira.ativo {border-color: #ff0044;background: rgba(255, 0, 68, 0.4);transform: scale(1.3);box-shadow: 0 0 35px #ff0044;}

.pino {position: absolute;width: 22px;height: 22px;border-radius: 50%;pointer-events: none;z-index: 20;transform: translate(-50%, -50%);}
#pino1 {background: #ff00ea;box-shadow: 0 0 20px #ff00ea;border: 3px solid #fff;}
#pino2 {background: #00f0ff;box-shadow: 0 0 20px #00f0ff;border: 3px solid #fff;}
#cursor {position: absolute;width: 40px;height: 40px;border: 2px dashed #00f0ff;border-radius: 50%;pointer-events: none;z-index: 19;transform: translate(-50%, -50%);animation: spin 4s linear infinite;}
@keyframes spin {from { transform: translate(-50%, -50%) rotate(0deg); }to { transform: translate(-50%, -50%) rotate(360deg); }}

#status-panel {position: absolute;bottom: 20px;right: 20px;width: 300px;background: rgba(5, 12, 24, 0.95);border: 2px solid #00f0ff;padding: 12px;border-radius: 8px;z-index: 10;}
.status-title {font-size: 11px;font-weight: bold;color: #ffe600;margin-bottom: 6px;}
.status-item {font-size: 11px;margin: 4px 0;color: #00f0ff;}
</style>
</head>
<body>

<div class="grid-bg"></div><div class="scanlines"></div>
<div id="lixeira">🗑️</div>

<div id="menu">
  <div class="menu-title"><span>> G15</span><span>v1.0</span></div>
  <button class="btn" id="novo">[1] + NOVO CUBO</button>
  <button class="btn" id="limpar">[2] RESETAR TUDO</button>
  <button class="btn" id="cor">[3] TROCAR COR</button>
</div>

<video id="video" autoplay playsinline muted></video>
<div id="pino1" class="pino"></div><div id="pino2" class="pino"></div><div id="cursor"></div>

<div id="status-panel">
  <div class="status-title">📡 K-AI STATUS</div>
  <div class="status-item">STATUS: <span id="st-text">INICIALIZANDO...</span></div>
  <div class="status-item">OBJETOS: <span id="st-obj">0</span></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
<script>
// ===== JS ORIGINAL =====
let cubos=[];
let cores=['#00f0ff','#ff00ea','#ffe600','#00ff66','#ff3366'];let corAtual=0;
let posSuave={x:-100,y:-100,cx:-100,cy:-100};

// CRIAR CUBO + MOUSE
function criarCubo(x,y){
  const c=document.createElement('div');c.className='cubo';
  c.style.left=(x||window.innerWidth/2-45)+'px';c.style.top=(y||window.innerHeight/2-45)+'px';
  c.style.borderColor=cores[corAtual];c.style.background=cores[corAtual]+'22';

  let isDragging=false,offsetX=0,offsetY=0;
  c.addEventListener('pointerdown',e=>{isDragging=true;offsetX=e.clientX-c.offsetLeft;offsetY=e.clientY-c.offsetTop;c.classList.add('segurado');c.setPointerCapture(e.pointerId);});
  c.addEventListener('pointermove',e=>{if(!isDragging)return;c.style.left=`${e.clientX-offsetX}px`;c.style.top=`${e.clientY-offsetY}px`;const lix=document.getElementById('lixeira').getBoundingClientRect();document.getElementById('lixeira').classList.toggle('ativo',Math.hypot(e.clientX-(lix.left+lix.width/2),e.clientY-(lix.top+lix.height/2))<90);});
  c.addEventListener('pointerup',e=>{isDragging=false;c.classList.remove('segurado');const lix=document.getElementById('lixeira').getBoundingClientRect();if(Math.hypot(e.clientX-(lix.left+lix.width/2),e.clientY-(lix.top+lix.height/2))<90){c.remove();cubos=cubos.filter(item=>item!==c);document.getElementById('st-obj').textContent=cubos.length;}document.getElementById('lixeira').classList.remove('ativo');});
  document.body.appendChild(c);cubos.push(c);document.getElementById('st-obj').textContent=cubos.length;
}

// MEDIAPIPE SÓ PRA MOVER O PINO
const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.5});

hands.onResults(res=>{
  const maos=res.multiHandLandmarks;
  if(maos&&maos.length>0){
    document.getElementById('st-text').textContent="MÃO DETECTADA";
    const h1=maos[0];
    let tx=(1-h1[8].x)*window.innerWidth,ty=h1[8].y*window.innerHeight;
    posSuave.x+=(tx-posSuave.x)*0.4;posSuave.y+=(ty-posSuave.y)*0.4;
    document.getElementById('pino1').style.left=posSuave.x+'px';document.getElementById('pino1').style.top=posSuave.y+'px';
  } else {
    document.getElementById('st-text').textContent="AGUARDANDO MÃO...";
  }
});

// BOTÕES
document.getElementById('novo').onclick=()=>criarCubo();
document.getElementById('limpar').onclick=()=>{cubos.forEach(c=>c.remove());cubos=[];document.getElementById('st-obj').textContent=0;};
document.getElementById('cor').onclick=()=>{corAtual=(corAtual+1)%cores.length;document.getElementById('cor').style.color=cores[corAtual];};

const camera=new Camera(document.getElementById('video'),{onFrame:async()=>{await hands.send({image:document.getElementById('video')});},width:640,height:480});
camera.start();
criarCubo();
</script>
</body>
</html>
