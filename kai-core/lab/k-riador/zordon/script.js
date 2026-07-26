const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000814);
scene.fog = new THREE.Fog(0x000814, 400, 1200);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 80, 750);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// LUZ AZUL DO COMANDO
const pointLight = new THREE.PointLight(0x00e5ff, 4, 2000);
pointLight.position.set(0, 200, 400);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0x001a33, 0.6));

// PAREDE COM GRADE
const gridGeo = new THREE.PlaneGeometry(1400, 900, 25, 18);
const gridMat = new THREE.MeshBasicMaterial({
  color: 0x00e5ff,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
const gridWall = new THREE.Mesh(gridGeo, gridMat);
scene.add(gridWall);

// LINHAS DE ENERGIA
for(let y = -400; y <= 400; y += 90){
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(1400, 4, 4),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 })
  );
  line.position.y = y;
  scene.add(line);
}

// ROSTO DO ZORDON
let faceMesh;
let isTalking = false;
const loader = new THREE.TextureLoader();
loader.load(
  "./zordon-face.png", // sua imagem tem que estar na mesma pasta do index.html

  function(texture) {
    const faceGeo = new THREE.PlaneGeometry(550, 550);
    const faceMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      color: 0x00e5ff, // deixa azul holograma
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = 5; // na frente da grade
    scene.add(faceMesh);
    animate();
  },
  undefined,
  function(err){
    console.error("ERRO: Não achou file_000000004980820ead22c12031f81004.png", err);
    alert("Coloca a imagem file_000000004980820ead22c12031f81004.png na pasta");
  }
);

// PARTÍCULAS
const particleGeo = new THREE.BufferGeometry();
const particleCount = 400;
const positions = new Float32Array(particleCount * 3);
for(let i = 0; i < particleCount * 3; i++){
  positions[i] = (Math.random() - 0.5) * 1500;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 2 });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// VOZ AO CLICAR
function speakZordon(text){
  if('speechSynthesis' in window){
    isTalking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.pitch = 0.4; // grave
    utterance.rate = 0.75; // lento
    utterance.onend = () => isTalking = false;
    speechSynthesis.speak(utterance);
  }
}

window.addEventListener('click', () => {
  if(!isTalking){
    const lines = [
      "Rangers, me escutem.",
      "O mal está se aproximando.",
      "Vocês precisam trabalhar juntos.",
      "A energia está com vocês."
    ];
    speakZordon(lines[Math.floor(Math.random() * lines.length)]);
  }
});

let time = 0;
function animate(){
  requestAnimationFrame(animate);
  time += 0.04;

  if(faceMesh){
    // Pulso do holograma
    faceMesh.material.opacity = 0.9 + Math.sin(time * 3) * 0.05;

    // Boca mexendo quando fala
    if(isTalking){
      faceMesh.scale.y = 1 + Math.sin(time * 35) * 0.04;
    } else {
      faceMesh.scale.y = 1 + Math.sin(time * 1.5) * 0.005; // respiração
    }

    // Piscar aleatório
    if(Math.random() > 0.996){
      faceMesh.material.opacity = 0.1;
      setTimeout(() => { if(faceMesh) faceMesh.material.opacity = 0.95; }, 120);
    }
  }

  // Parede pulsando
  gridWall.material.opacity = 0.25 + Math.sin(time) * 0.05;
  pointLight.intensity = 3.5 + Math.sin(time * 2) * 0.5;

  // Partículas subindo
  const pos = particles.geometry.attributes.position;
  for(let i = 1; i < pos.count; i += 3){
    pos.array[i] += 0.8;
    if(pos.array[i] > 600) pos.array[i] = -600;
  }
  pos.needsUpdate = true;

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
