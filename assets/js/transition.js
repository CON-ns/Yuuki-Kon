import * as THREE from "//unpkg.com/three@0.148.0/build/three.module.js";

const loadCanvas = document.getElementById('js-transitionCanvas');
const loader = document.querySelector('.js-transition');
const loadText1 = document.querySelector('.js-loadText1');
const loadText2 = document.querySelector('.js-loadText2');
const container = document.querySelector('.container')


let camera, scene, renderer, geometry, material,cancelId;

function setUpLoadCanvas() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas:loadCanvas,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff,0);
  const canvas = loadCanvas;
  const canvasW = canvas.clientWidth;
  const canvasH = canvas.clientHeight;
  
  scene = new THREE.Scene();
  const fov = 60;
  const fovRad = (fov / 2) * (Math.PI / 180);
  const dist = canvasW / 2 / Math.tan(fovRad);
  camera = new THREE.PerspectiveCamera(
    fov,
    canvasW / canvasH,
    0.1,
    10000
    );
    camera.position.z = dist;
    const geometry = new THREE.PlaneGeometry(canvasW * 2,canvasH * 2);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTick: { value: 0 },
      },
      vertexShader:document.getElementById('v-shader-transition').textContent,
      fragmentShader:document.getElementById('f-shader-transition').textContent,
      transparent: true,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
}


function transitionLoop() {
  let previousTime = performance.now();
  let elapsed;
  function animate() {
    const currentTime = performance.now();
    elapsed = ((currentTime - previousTime) / 1000).toFixed(2);
    material.uniforms.uTick.value = elapsed;
   renderer.render(scene, camera);
    cancelId = requestAnimationFrame(animate);
  }
  animate();
}
setUpLoadCanvas();

barba.init({
  sync:true,
  transitions: [
    {
      async leave(data) {
        if (container.classList.contains('is-loaded')) {
          container.classList.remove('is-loaded');
        }
        const done = this.async();
        leaveAnimation();
        pageTransition();
        await delay(4000);
        done();
      },
      afterLeave(data) {
        midAnimation();
        window.scroll({top:0,behavior:"smooth"})
      },
      async beforeEnter(data) {
        await delay(1500);
        window.location.reload();
      },
      async enter(data) {
        enterAnimation();
        if (container.classList.contains('is-loaded')) {
          container.classList.add('is-loaded');
        }
      }
    }
  ]
});


// 遅延用 引数の分だけ処理を遅らせる
function delay (n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

// ページを離れる時の上に消える動作
function leaveAnimation () {
  const tl = gsap.timeline();
  tl.to('.container', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
}

function midAnimation() {
  const tl = gsap.timeline();
  tl.to(loadText1, {
    delay:0.5,
    duration:0.7,
    y: -20,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
  tl.to(loadText2, {
    delay:-0.4,
    duration:0.6,
    y: -20,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
}

// ページに入る直前。遷移画面の文字が上に消えて遷移する
async function enterAnimation() {
  const tl = gsap.timeline();
  tl.to(loader, {
    delay:-0.7,
    duration: 0.8,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
  tl.from('.container', {
    delay:-0.6,
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
  await delay(1000);
  const container = document.querySelector('.container');
  console.log(container);
  container.classList.add('is-loaded');
  cancelAnimationFrame(cancelId);
}

//遷移画面を出現
function pageTransition() {
  transitionLoop();
  const tl = gsap.timeline();
  tl.fromTo(loader, {
    opacity:0,
  },{
    delay:0.2,
    duration: 0.8,
    opacity: 1,
    ease: 'Quart.easeOut'
  });
  tl.fromTo(loadText1, {
    y: 0,
    opacity:0,
  }, {
    opacity: 1,
    duration:1,
    y:-10,
    ease: 'Quart.easeOut'
  });
  tl.fromTo(loadText2, {
    y: 0,
    opacity:0,
  }, {
    delay:-0.7,
    duration: 1,
    y: -10,
    opacity: 1,
    ease: 'Quart.easeOut'
  });
}
