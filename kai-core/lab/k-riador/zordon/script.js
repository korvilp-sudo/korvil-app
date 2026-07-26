const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000814); // azul escuro comando
scene.fog = new THREE.Fog(0x000814, 500, 1500);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 100, 800); // olhando pra parede

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// LUZES AZUIS DO COMANDO
const light = new THREE.PointLight(0x00e5ff, 4, 2000);
light.position.set(0, 200, 500);
scene.add(light);
const ambLight = new THREE.AmbientLight(0x001a33, 0.5);
scene.add(ambLight);

// GRUPO DA PAREDE
const wallGroup = new THREE.Group();
scene.add(wallGroup);

// 1. PAINEL DE FUNDO GIGANTE
const bgPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 1200),
  new THREE.MeshBasicMaterial({ color: 0x000814 })
);
bgPanel.position.z = -100;
wallGroup.add(bgPanel);

// 2. GRADE DA PAREDE
const gridGeo = new THREE.PlaneGeometry(1400, 900, 20, 15);
const gridMat = new THREE.MeshBasicMaterial({
  color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.25
});
const grid = new THREE.Mesh(gridGeo, gridMat);
wallGroup.add(grid);

// 3. ROSTO DO ZORDON NA PAREDE
let face;
const loader = new THREE.TextureLoader();
loader.load(
  "./file_000000004980820ead22c12031f81004.png", // coloca tua imagem com esse nome na pasta zordon

  function(texture) {
    const faceGeo = new THREE.PlaneGeometry(600, 600); // grande igual filme
    const faceMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      color: 0x00e5ff, // tom ciano holograma
      blending: THREE.AdditiveBlending
    });
    face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 10; // na frente da grade
    wallGroup.add(face);
    animate();
  },
  undefined,
  function(err){ console.error("ERRO: file_000000004980820ead22c12031f81004.png não encontrada", err); }
);

// 4. LINHAS DE ENERGIA HORIZONTAIS
for(let y = -400; y <= 400; y += 100){
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(1400, 3, 3),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.4 })
  );
  line.position.y = y;
  wallGroup.add(line);
}

// 5. PARTÍCULAS
const particles = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0x00e5ff, size: 2.5 })
);
const pArray = new Float32Array(500 * 3);
for(let i=0; i<500*3; i++) pArray[i] = (Math.random()-0.5)*1600;
particles.geometry.setAttribute('position', new THREE.BufferAttribute(pArray, 3));
scene.add(particles);

// VOZ + ANIMAÇÃO
let falando = false;
function falar(texto){
  if('speechSynthesis' in window){
    falando = true;
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR'; msg.pitch = 0.4; msg.rate = 0.75;
    msg.onend = () => falando = false;
    speechSynthesis.speak(msg);
  }
}
window.addEventListener('click', () => {
  if(!falando){
    const frases = ["Rangers.", "É hora de lutar.", "A energia está com vocês.", "Preciso da sua ajuda."];
    falar(frases[Math.floor(Math.random()*frases.length)]);
  }
});

let t = 0;
function animate(){
  requestAnimationFrame(animate);
  t += 0.03;

  if(face){
    // pulso holograma
    face.material.opacity = 0.9 + Math.sin(t*4)*0.05;
    // boca mexendo
    face.scale.y = falando? 1 + Math.sin(t*40)*0.04 : 1;
    // piscar
    if(Math.random() > 0.996) face.material.opacity = 0.1;
  }

  grid.material.opacity = 0.2 + Math.sin(t)*0.05;
  light.intensity = 3.5 + Math.sin(t*2)*0.5;

  // particulas sobem
  const pos = particles.geometry.attributes.position;
  for(let i=1; i<pos.count; i+=3){ pos.array[i] += 1; if(pos.array[i]>600) pos.array[i] = -600; }
  pos.needsUpdate = true;

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
