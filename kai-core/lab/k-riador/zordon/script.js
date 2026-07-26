const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000814); // azul escuro do comando
scene.fog = new THREE.Fog(0x000814, 400, 1200);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 700); // afasta pra ver a parede toda

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// LUZES AZUIS DO COMANDO
const light = new THREE.PointLight(0x00e5ff, 3, 2000);
light.position.set(0, 0, 400);
scene.add(light);

// GRUPO DA PAREDE
const wallGroup = new THREE.Group();
scene.add(wallGroup);

// 1. PAINEL DE FUNDO COM GRADE
const panelGeo = new THREE.PlaneGeometry(1200, 800, 20, 20);
const panelMat = new THREE.MeshBasicMaterial({
  color: 0x001a33,
  wireframe: true,
  transparent: true,
  opacity: 0.4
});
const panel = new THREE.Mesh(panelGeo, panelMat);
panel.position.z = -50;
wallGroup.add(panel);

// 2. ROSTO DO ZORDON NA PAREDE - USA TUA IMAGEM
const loader = new THREE.TextureLoader();
loader.load(
  "./zordon-face.png", // coloca tua imagem com esse nome na pasta

  function(texture) {
    console.log("✅ Rosto carregado na parede");

    const faceGeo = new THREE.PlaneGeometry(500, 500); // tamanho do rosto
    const faceMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      color: 0x00e5ff, // deixa azul holograma
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0; // na frente do painel
    wallGroup.add(face);

    animate();
  },

  undefined,

  function(error){
    console.error("❌ ERRO: Não achou zordon-face.png na pasta zordon", error);
  }
);

// 3. LINHAS DE ENERGIA HORIZONTAIS
for(let i = -400; i <= 400; i += 80){
  const lineGeo = new THREE.BoxGeometry(1200, 2, 2);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.3 });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.position.y = i;
  wallGroup.add(line);
}

// 4. PARTÍCULAS FLUTUANDO
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 300;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++){
  posArray[i] = (Math.random() - 0.5) * 1000;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 2 });
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

function animate(){
  requestAnimationFrame(animate);

  // Parede pulsa levemente
  wallGroup.scale.set(1 + Math.sin(Date.now()*0.001)*0.01, 1, 1);

  // Partículas mexem
  particles.rotation.y += 0.0005;

  renderer.render(scene, camera);
}

window.addEventListener("resize", function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
