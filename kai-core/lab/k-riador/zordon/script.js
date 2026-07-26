const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
2000
);

camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({
antialias:true,
alpha:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document
.getElementById("container")
.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

loader.load(

"./rosto.png",

function(texture){

console.log("Imagem carregada");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = texture.image.width;
canvas.height = texture.image.height;

ctx.drawImage(texture.image,0,0);

const img = ctx.getImageData(
0,
0,
canvas.width,
canvas.height
);

const vertices = [];

for(let y=0;y<canvas.height;y+=2){

for(let x=0;x<canvas.width;x+=2){

const index =
(y * canvas.width + x) * 4;

const r = img.data[index];
const g = img.data[index + 1];
const b = img.data[index + 2];
const a = img.data[index + 3];

const brightness =
(r + g + b) / 3;

if(a > 5 || brightness > 10){

vertices.push(
x - canvas.width/2,
canvas.height/2 - y,
brightness * 0.25
);

}

}

}

const geometry =
new THREE.BufferGeometry();

geometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(
vertices,
3
)
);

const material =
new THREE.PointsMaterial({
color:0x00ffff,
size:4,
transparent:true,
opacity:1
});

const points =
new THREE.Points(
geometry,
material
);

scene.add(points);

function animate(){

requestAnimationFrame(
animate
);

const pos =
points.geometry.attributes.position;

const time =
Date.now() * 0.001;

for(let i=0;i<pos.count;i++){

const x = pos.getX(i);

pos.setZ(
i,
Math.sin(
time + x * 0.02
) * 15
);

}

pos.needsUpdate = true;

renderer.render(
scene,
camera
);

}

animate();

},

undefined,

function(error){

console.error(
"Erro ao carregar rosto.png",
error
);

}

);

window.addEventListener(
"resize",
function(){

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

}
);
