import * as THREE from "//unpkg.com/three@0.148.0/build/three.module.js";
import { ScrollObserver } from "./_class.js";
import { StickAnime } from "./_class.js";

let scrollY; //スクロール量格納用

window.addEventListener('DOMContentLoaded', function () {
  mediaQueryFunc();
  mediaReload();
  playgroundLink();
});


// //----------------------------------------------------------------
//背景ノイズ--------------------------------------------------------
const gradient = new Gradient();
gradient.initGradient("#canvas-bg");
//---------------------------------------------------------------------------------
//スクロール方向検知
let scrollDir = "down";
let set_position = 0;
window.addEventListener("scroll", function () {
  if (set_position < document.documentElement.scrollTop) {
    scrollDir = "down";
  } else {
    scrollDir = "up";
  }
  set_position = document.documentElement.scrollTop;
});
window.addEventListener("touchmove", function () {
  if (set_position < document.documentElement.scrollTop) {
    scrollDir = "down";
  } else {
    scrollDir = "up";
  }
  set_position = document.documentElement.scrollTop;
});
//---------------------------------------------------------------------------------
//fadeUpAnimation
const fadeUpCb = function fadeUpAnime(el, isIntersecting) {
  el.setAttribute('style', `opacity:0;transform:translateY(50px)`);
  if (isIntersecting) {
    let timings = {
      easing: "cubic-bezier(.19,.2,.1,.38)",
      fill: "forwards",
    };
    timings.duration = 1300;
    el.animate(
      [
        { transform: `translateY(30px)`, opacity: 0, },
        { transform: `translateY(-8px)`, opacity: 1, },
        { transform: `translateY(0px)`, opacity: 1, },
      ],
      timings
      );
    }
  }
  const fadeLtRCb = function fadeUpAnime(el, isIntersecting) {
    el.setAttribute('style', `opacity:0;transform:translateY(50px)`);
    if (isIntersecting) {
      let timings = {
        easing: "cubic-bezier(.19,.2,.1,.38)",
        fill: "forwards",
      };
      timings.duration = 1300;
      el.animate(
        [
          { transform: `translateX(-30px)`, opacity: 0, },
          { transform: `translateX(8px)`, opacity: 1, },
          { transform: `translateX(0px)`, opacity: 1, },
        ],
        timings
        );
      }
    }

    const fadeLtREls = document.querySelectorAll('.js-fadeLtRTarget')
    const fadeLtrSo = new ScrollObserver(fadeLtREls, fadeLtRCb, "0px 0px -150px 0px");
    const fadeUpEls = document.querySelectorAll('.js-fadeUpTarget')
    const fadeUpSo = new ScrollObserver(fadeUpEls, fadeUpCb, "0px 0px -150px 0px");


//-----------------------------------------------------------------------------------------
//吸い付くボタン
const stickAnimeInstance = new StickAnime(document.querySelectorAll(".js-stickOuter"),40);
const stickAnimeInstanceProfile = new StickAnime(document.querySelectorAll(".js-stickOuterProfile"),20);
// const stickAnimeInstanceTop = new StickAnime(document.querySelectorAll(".js-stickOuterTop"),20);
stickAnimeInstance.stickyMovePx();
stickAnimeInstanceProfile.stickyMovePx();
// stickAnimeInstanceTop.stickyMovePx();
//-


let mediaQueryPC, mediaQueryTablet, mediaQueryMobile,mediaFlag;

//メディアクエリ用関数
function mediaQueryFunc() {
  mediaFlag;
  mediaQueryPC = window.matchMedia("(min-width:1024px)");
  mediaQueryTablet = window.matchMedia("(max-width:1023px) and (min-width:768px)");
  mediaQueryMobile = window.matchMedia("(max-width:767px)");
  
  function mediaCheckPC(event) {
    if (event.matches) {
      mediaFlag = "pc";
    }
  }
  function mediaCheckTablet(event) {
    if (event.matches) {
      mediaFlag = "tablet";
    }
  }
  function mediaCheckMobile(event) {
    if (event.matches) {
      mediaFlag = "mobile";
    }
  }
  
  mediaQueryPC.addEventListener('change',mediaCheckPC);
  mediaQueryTablet.addEventListener('change',mediaCheckTablet);
  mediaQueryMobile.addEventListener('change', mediaCheckMobile);
  
  mediaCheckPC(mediaQueryPC);
  mediaCheckTablet(mediaQueryTablet);
  mediaCheckMobile(mediaQueryMobile);
}

function mediaReload(){
    //リサイズ時(ブレイクポイントを超える度に発火)
  mediaQueryPC.addEventListener('change', function () {
    if (mediaFlag === "pc") {
      //pcサイズ(1024px以上)
      window.location.reload();
    }
  });
  mediaQueryTablet.addEventListener('change', function () {
    if (mediaFlag === "tablet") {
      //タブレットサイズ(768px以上1024px未満)
      window.location.reload();
    }
  });
  mediaQueryMobile.addEventListener('change', function () {
    if (mediaFlag === "mobile") {
      //モバイルサイズ(768px未満)
      window.location.reload();
    }
  });
}




// ---------------------------------------------------------------
// three.js


function playgroundLink() {
  const canvas = document.getElementById("js-playgroundCanvas");
  // Scene
  const scene = new THREE.Scene();
  if (!canvas) return;
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight / 2,
  };
  const fov = 75,
    aspect = sizes.width / sizes.height,
    near = 0.1,
    far = 3000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-1, 2, -3);
  scene.add(camera);
  if (mediaFlag === "pcL" || mediaFlag === "pc") {
    camera.position.set(-1, 2, -3);
  } else {
    camera.position.set(-1, 2, -3.5);
  }
  scene.add(camera);
  canvas.addEventListener("mouseover", function () {
    gsap.to(camera.position, {
      z: -2.6,
      duration: 0.4,
      onComplete: () => {
        camera.updateProjectionMatrix();
      },
    });
  });
  canvas.addEventListener("mouseout", function () {
    gsap.to(camera.position, {
      z: -3,
      duration: 0.4,
      onComplete: () => {
        camera.updateProjectionMatrix();
      },
    });
  });

  const light = new THREE.DirectionalLight(0xC9EBF2, 1);
  const ambientLight = new THREE.AmbientLight(0xC9EBF2,1);
  scene.add(light, ambientLight);

  //ジオメトリを定義
  const geometry = new THREE.BoxGeometry(5, 2,1);

  //マテリアルを定義
  const material = new THREE.MeshToonMaterial({
    map: new THREE.TextureLoader().load("./assets/images/playground.png"),
  });
  const cube = new THREE.Mesh(geometry, material);
  camera.lookAt(cube.position);
  scene.add(cube);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000,0);

  // Animate
  let rotateX = 0;
  const animate = () => {
    if (cube !== undefined && scrollDir === "down") {
      rotateX += 0.005;
      cube.rotation.x += 0.005;
    } else if (cube !== undefined && scrollDir === "up") {
      rotateX -= 0.005;
      cube.rotation.x -= 0.005;
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  window.addEventListener("scroll", function (e) {
    scrollY = window.pageYOffset;
    if (cube !== undefined) {
      cube.rotation.x = rotateX + scrollY * 0.003;
    }
  });

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight / 2;

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  animate();
}
