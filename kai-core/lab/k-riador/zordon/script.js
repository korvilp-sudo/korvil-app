const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 450);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// LUZ
scene.add(new THREE.AmbientLight(0x001111));
const light = new THREE.PointLight(0x00ffff, 3, 1000);
light.position.set(0, 100, 400);
scene.add(light);

let pointCloud;
let isTalking = false;

const loader = new THREE.TextureLoader();
loader.load(
  "./file_000000004980820ead22c12031f81004.png", // SUA IMAGEM

  function(texture) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    ctx.drawImage(texture.image, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const geo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const gap = 3; // quanto menor, mais pontos. 3 = bem detalhado
    const scale = 300;

    for(let y = 0; y < canvas.height; y += gap){
      for(let x = 0; x < canvas.width; x += gap){
        const i = (y * canvas.width + x) * 4;
        const alpha = data[i + 3];

        if(alpha > 30){ // só onde tem imagem
          positions.push(
            (x - canvas.width/2) * (scale/canvas.width),
            -(y - canvas.height/2) * (scale/canvas.height),
            (Math.random()-0.5)*2
          );
          // cor ciano do filme
          colors.push(0.1, 0.9, 1.0);
        }
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    pointCloud = new THREE.Points(geo, mat);
    scene.add(pointCloud);
    animate();
  },
  undefined,
  (e) => console.error("ERRO: file_000004980820ead22c12031f81004.png não encontrada", e)
);

// GRADE FUNDO
const grid = new THREE.GridHelper(1000, 40, 0x00ffff, 0x003333);
grid.rotation.x = Math.PI/2;
scene.add(grid);

// VOZ
function falar(txt){
  if('speechSynthesis' in window){
    isTalking = true;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang='pt-BR'; u.pitch=0.35; u.rate=0.7;
    u.onend = () => isTalking = false;
    speechSynthesis.speak(u);
  }
}
window.addEventListener('click', () => {
  if(!isTalking) falar("Onde estou?");
});

let t = 0;
function animate(){
  requestAnimationFrame(animate);
  t += 0.03;

  if(pointCloud){
    // EFEITO ONDA
    const pos = pointCloud.geometry.attributes.position;
    for(let i=2; i<pos.count*3; i+=3){
      pos.array[i] = Math.sin(t + pos.array[i-1]*0.1) * 4;
    }
    pos.needsUpdate = true;

    // BOCA MEXENDO
    pointCloud.scale.y = isTalking? 1 + Math.sin(t*50)*0.03 : 1;
    pointCloud.rotation.y += 0.0005;
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
