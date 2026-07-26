const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000); // tira o ciano

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

loader.load(
  "./file_000004980820ead22c12031f81004.png", // confere se o nome tá igual

  function(texture) {
    console.log("Imagem carregada:", texture.image.width, "x", texture.image.height);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    ctx.drawImage(texture.image, 0, 0);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const vertices = [];

    for(let y = 0; y < canvas.height; y += 2){
      for(let x = 0; x < canvas.width; x += 2){
        const index = (y * canvas.width + x) * 4;
        const r = img.data[index];
        const g = img.data[index + 1];
        const b = img.data[index + 2];
        const a = img.data[index + 3];
        const brightness = (r + g + b) / 3;

        if(a > 5 && brightness > 10){ // mudei pra && pra ficar mais limpo
          vertices.push(
            x - canvas.width/2,
            canvas.height/2 - y,
            brightness * 0.25
          );
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 3, // diminui um pouco pra não ficar pesado no celular
      transparent: true,
      opacity: 1
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function animate(){
      requestAnimationFrame(animate);

      points.rotation.y += 0.002; // gira o Zordon

      const pos = points.geometry.attributes.position;
      const time = Date.now() * 0.001;

      for(let i = 0; i < pos.count; i++){
        const x = pos.getX(i);
        pos.setZ(i, Math.sin(time + x * 0.02) * 15); // onda de energia
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();
  },

  undefined,

  function(error){
    console.error("ERRO: Não achou a PNG. Nome correto?", error);
    // Fallback: cria um tubo se a imagem falhar
    const geo = new THREE.CylinderGeometry(100, 100, 400, 32);
    const mat = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
    scene.add(new THREE.Mesh(geo, mat));
    renderer.render(scene, camera);
  }
);

window.addEventListener("resize", function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
