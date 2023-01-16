import { ScrollObserver } from "./_class.js";
import * as THREE from "//unpkg.com/three@0.148.0/build/three.module.js";

let mediaQueryPCLarge, mediaQueryPC, mediaQueryTablet, mediaQueryMobile, mediaFlag; //メディアクエリ用変数
const canvas = document.getElementById("webgl-canvas");
const canvasEls = document.querySelectorAll('.js-mvCanvas');


window.addEventListener('DOMContentLoaded', function () {
  mediaQueryFunc();
  mvAnime();
  if (mediaFlag === "pcL" || mediaFlag === "pc") {
    mvRipple();
  } else if (mediaFlag === "tablet" || mediaFlag === "mobile") {
    mvBlotter();
  }
  meImg();
  scaleIn()
})

//------------------------------------------------------------------------------
//mvアニメーション
function mvAnime() {
  gsap.fromTo('.p-profile-mv', {
    opacity: 0,
    y:15
  }, {
    opacity: 1,
    y: 0,
    duration: 2.5,
    ease: "Power4.easeInOut",
  })
}


//----------------------------------------------------------------
//メディアクエリ用関数
function mediaQueryFunc() {
  mediaFlag;
  mediaQueryPCLarge = window.matchMedia("(min-width:1280px)");
  mediaQueryPC = window.matchMedia("(min-width:1024px) and (max-width:1279px)");
  mediaQueryTablet = window.matchMedia(
    "(max-width:1023px) and (min-width:768px)"
  );
  mediaQueryMobile = window.matchMedia("(max-width:767px)");

  function mediaCheckPCLarge(event) {
    if (event.matches) {
      mediaFlag = "pcL";
    }
  }
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

  mediaQueryPCLarge.addEventListener("change", mediaCheckPCLarge);
  mediaQueryPC.addEventListener("change", mediaCheckPC);
  mediaQueryTablet.addEventListener("change", mediaCheckTablet);
  mediaQueryMobile.addEventListener("change", mediaCheckMobile);

  mediaCheckPCLarge(mediaQueryPCLarge);
  mediaCheckPC(mediaQueryPC);
  mediaCheckTablet(mediaQueryTablet);
  mediaCheckMobile(mediaQueryMobile);
}


//----------------------------------------------------------------
//マウスストーカー
let cursorX, cursorY;
let scale = 0;
const cursorInner = document.getElementById("js-cursorInner");
const cursorOuter = document.getElementById("js-cursorOuter");
window.addEventListener("mousemove", function (e) {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorInner.setAttribute(
    "style",
    `transform:translate(${cursorX}px,${cursorY}px)`
    );
    if (cursorOuter !== null) {
      cursorOuter.setAttribute(
        "style",
        `transform:translate(${cursorX}px,${cursorY}px) scale(${scale})`
        );
      }
    });
    
    const linkEls = document.querySelectorAll('a');
    linkEls.forEach(link => {
      link.addEventListener('mouseover', function () {
        cursorInner.classList.add('is-hovLink');
      });
      link.addEventListener('mouseout', function () {
        cursorInner.classList.remove('is-hovLink');
      });
    })
//----------------------------------------------------------------
    
    
    function mvBlotter() {
      const disTxt = document.querySelectorAll('.js-blotter');
  const MathUtils = {
    // ラインの方程式
    lineEq: (y2, y1, x2, x1, currentVal) => {
      var m = (y2 - y1) / (x2 - x1),
        b = y1 - m * x1;
      return m * currentVal + b;
    },
  
    // 線形補間の関数
    lerp: (a, b, n) => (1 - n) * a + n * b,
  };
  
  // Blotterのマテリアルを作成
  const material = new Blotter.LiquidDistortMaterial();
  
  // デフォルトのマテリアルuniform値を設定
  material.uniforms.uSpeed.value = 0.5;
  
  material.uniforms.uVolatility.value = 0;
  
  material.uniforms.uSeed.value = 0.4;
  
  const blotter = new Blotter(material);
  
  // data-blotterを持つすべてのHTML要素においてBlotterテキストを初期化
  const blotterElemsS = [...document.querySelectorAll("[data-blotter-s]")];
  const blotterElemsM = [...document.querySelectorAll("[data-blotter-m]")];
  const blotterElemsL = [...document.querySelectorAll("[data-blotter-l]")];
  
  //初回ロード時
  if (mediaFlag === "pcL") {
  //pcサイズ(1280px以上)
    return;
  }
  else if (mediaFlag === "pc") {
   //pcサイズ(1024px以上)
    return;
 } else if (mediaFlag === "tablet") {
   //タブレットサイズ(768px以上1024px未満)
   blotterElemsM.forEach((el) => {
    const text = new Blotter.Text(el.innerHTML, {
      size:250,
      weight: 180,
      color:"#251D18",
      family : "'eloquent-jf-pro', serif",
    });
    blotter.addText(text);
    // ここでHTMLコンテンツを削除
    el.innerHTML = "";
    // 作成されたキャンバス
    const scope = blotter.forText(text);
    // メイン要素に添える
    scope.appendTo(el);
  });
  blotterElemsS.forEach((el) => {
    const text = new Blotter.Text(el.innerHTML, {
      size:100,
      weight: 180,
      color:"#251D18",
      family: "'eloquent-jf-pro', serif",
    });
    blotter.addText(text);
    // ここでHTMLコンテンツを削除
    el.innerHTML = "";
    // 作成されたキャンバス
    const scope = blotter.forText(text);
    // メイン要素に添える
    scope.appendTo(el);
  });
  blotterElemsL.forEach((el) => {
    const text = new Blotter.Text(el.innerHTML, {
      size:200,
      weight: 180,
      color:"#251D18",
      family : "'eloquent-jf-pro', serif",
    });
    blotter.addText(text);
    // ここでHTMLコンテンツを削除
    el.innerHTML = "";
    // 作成されたキャンバス
    const scope = blotter.forText(text);
    // メイン要素に添える
    scope.appendTo(el);
  });
 } else if (mediaFlag === "mobile") {
   //モバイルサイズ(768px未満)
   blotterElemsM.forEach((el) => {
    const text = new Blotter.Text(el.innerHTML, {
      size:125,
      weight: 180,
      color: "#251D18",
      family : "'eloquent-jf-pro', serif",
    });
    blotter.addText(text);
    // ここでHTMLコンテンツを削除
    el.innerHTML = "";
    // 作成されたキャンバス
    const scope = blotter.forText(text);
    // メイン要素に添える
    scope.appendTo(el);
  });
  blotterElemsS.forEach((el) => {
    const text = new Blotter.Text(el.innerHTML, {
      size:50,
      weight: 180,
      color:"#251D18",
      family: "'eloquent-jf-pro', serif",
    });
    blotter.addText(text);
    // ここでHTMLコンテンツを削除
    el.innerHTML = "";
    // 作成されたキャンバス
    const scope = blotter.forText(text);
    // メイン要素に添える
    scope.appendTo(el);
  });
  blotterElemsL.forEach((el) => {
    const text = new Blotter.Text(el.innerHTML, {
      size:100,
      weight: 180,
      color:"#251D18",
      family : "'eloquent-jf-pro', serif",
    });
    blotter.addText(text);
    // ここでHTMLコンテンツを削除
    el.innerHTML = "";
    // 作成されたキャンバス
    const scope = blotter.forText(text);
    // メイン要素に添える
    scope.appendTo(el);
  });
  }

 
 //リサイズ時(ブレイクポイントを超える度に発火)
 mediaQueryPCLarge.addEventListener('change', function () {
   if (mediaFlag === "pcL") {
     //pcサイズ(1280px以上)
     window.location.reload();
    }
  });
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
  
let currentScroll = window.pageYOffset;

// volatilityは変化するuniformを示す
let volatility = 0;

// 0（スクロールなし）から0.9（maxscrollの速度でのスクロール）まで設定可能
const maxscroll = 3;
const uniformValuesRange = [0, 0.04];

// requestAnimationFrameと線形補間を使用し効果を演出
  const render = () => {
    // 現在のスクロ-ル位置
    const newScroll = window.pageYOffset;

    // 最後のリペイントからどれだけスクロールしたか
    const scrolled = Math.abs(newScroll - currentScroll);

    // volatilityの新たな値を取得
    volatility = MathUtils.lerp(
      volatility,
      Math.min(
        MathUtils.lineEq(
          uniformValuesRange[1],
          uniformValuesRange[0],
          maxscroll,
          0,
          scrolled
        ),
        0.9
      ),
      0.05
    );

    // volatilityを設定
    material.uniforms.uVolatility.value = volatility;

    // 現在のスクロール位置を更新
    currentScroll = newScroll;

    // 繰り返し
    requestAnimationFrame(render);
  };
requestAnimationFrame(render);
}


function mvRipple() {
let camera, scene, scene1, renderer, mesh;
let baseTexture;
const max = 100; //mesh描画数
let mouse = new THREE.Vector2(-1, -1);
let prevMouse = new THREE.Vector2(0, 0); //動く前のカーソル座標
let currentWave = 0;
  let meshes = [];
  let stopId,rafFlag;

//サイズを定義
const sizes = {
  width:innerWidth,
  height:innerHeight,
};

init();

function init() {

  //シーンを定義
  scene = new THREE.Scene();

  //カメラを定義
  const frustumSize = sizes.height;
  const aspect = sizes.width / sizes.height;
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    -1000,
    1000
  );
  camera.position.set(0, 0, 2);
  scene.add(camera);

  //ripple画像の読み込み
  let rippleImg = new THREE.TextureLoader().load("assets/images/ripple.png");

  const geometry = new THREE.PlaneGeometry(64, 64, 1, 1);//波紋を貼るplane

  for (let i = 0; i < max; i++) {
    let m = new THREE.MeshBasicMaterial({
      map: rippleImg,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });

    mesh = new THREE.Mesh(geometry, m);
    mesh.visible = false;
    mesh.rotation.z = 2 * Math.PI * Math.random();
    scene.add(mesh);
    meshes.push(mesh);
  }

  canvas.addEventListener("mousemove", function () {
    trackMousePos();
  });

  //----------------------------------------------------

  //レンダラーを定義
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, //アンチエイリアスを適応
  });
  renderer.setSize(sizes.width, sizes.height); //サイズを指定
  renderer.setPixelRatio(window.devicePixelRatio); //アスペクト比を指定
  renderer.render(scene, camera);

  //リサイズ対応
  window.addEventListener("resize", onWindowResize);
}

//カーソル座標を取得してmeshのpositionにセット
  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX - sizes.width / 2;
    mouse.y = sizes.height / 2 - e.offsetY;
  });
  

//波紋をリセットする
function setNewWave(x, y, index) {
  let me = meshes[index];
  me.visible = true;
  me.position.x = x;
  me.position.y = y;
  me.scale.x = me.scale.y = 0.2; //サイズの初期値
  me.material.opacity = 0.5; //opacity初期値を設定
}

function trackMousePos() {
  if (
    Math.abs(mouse.x - prevMouse.x) > 20 &&
    Math.abs(mouse.y - prevMouse.y) > 20
  ) {
    //nothing
  } else {
    setNewWave(mouse.x, mouse.y, currentWave);
    currentWave = (currentWave + 1) % max; //1〜maxまでmousemoveしたら増加する変数
  }
  prevMouse.x = mouse.x;
  prevMouse.y = mouse.y;
}

//オフスクリーンレンダリング用の処理
scene1 = new THREE.Scene();
baseTexture = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

const geometryFullScreen = new THREE.PlaneGeometry(
  sizes.width,
  sizes.height,
  1,
  1
);

function addObject() {
  const subMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      uDisplacement: { value: null },
      uTexture: { value: new THREE.TextureLoader().load("assets/images/profile-mv.webp") },//背景画像を設定
    },
    vertexShader: document.getElementById("v-shader").textContent,
    fragmentShader: document.getElementById("f-shader").textContent,
  });
  return subMaterial;
}
const subMaterial = addObject();
const quad = new THREE.Mesh(geometryFullScreen, subMaterial);
scene1.add(quad);

//リサイズ対応関数
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//アニメーション用関数
let render = function(rafFlag) {
  renderer.setRenderTarget(baseTexture);
  renderer.render(scene, camera);
  subMaterial.uniforms.uDisplacement.value = baseTexture.texture; //画像情報をdisplacementに格納
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene1, camera);
  //meshes配列の中身全てを一つ一つ取り出してrotationをさせる
  meshes.forEach((mesh) => {
    if (mesh.visible) {
      mesh.rotation.z += 0.02;
      mesh.material.opacity *= 0.98; //徐々に消す
      mesh.scale.x = 0.982 * mesh.scale.x + 0.108; //波紋のサイズを調整(徐々に拡大する)
      mesh.scale.y = mesh.scale.x;
      if (mesh.material.opacity < 0.002) {
        mesh.visible = false;
      }
    }
  });
  if (rafFlag) {
    stopId = requestAnimationFrame(render);
  } else {
    cancelAnimationFrame(stopId);
    return;
  }
}
const cb = function (el, isIntersecting) {
  if (isIntersecting) {
    rafFlag = true;
    render(rafFlag);
  } else {
    cancelAnimationFrame(stopId);
  }
}
const inviewCanvas = new ScrollObserver(canvasEls, cb, "-100px", { once: false });
}


function meImg() {
  let camera, scene, renderer,uniforms,geometry;

//サイズを定義
const canvas = document.getElementById("img-canvas");
let sizes = {
  width: innerWidth,
  height: innerHeight,
};

function init() {
  //シーンを定義
  scene = new THREE.Scene();
  //カメラを定義(window座標とwebGL座標を一致させるため調整)
  const fov = 60,
    fovRad = (fov / 2) * (Math.PI / 180), //中心から左右30度ずつの視野角で丁度60度
    aspect = sizes.width / sizes.height,
    dist = sizes.height / 2 / Math.tan(fovRad),
    near = 0.1,
    far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = dist;
  scene.add(camera);

  //レンダラーを定義
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, //アンチエイリアスを適応
    alpha:true,
  });
  renderer.setSize(sizes.width, sizes.height); //サイズを指定
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio); //アスペクト比を指定

  // リサイズ（負荷軽減のためリサイズが完了してから発火する）
  let timeoutId = 0;
  window.addEventListener('resize', () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(onWindowResize, 200);
  });
}

//画像をテクスチャにしたPlaneを扱うクラス
class ImagePlane {
  constructor(mesh, img) {
    this.refImage = img;//参照する要素
    this.mesh = mesh;
  }
  setParams() {
    //参照するimg要素から大きさ、位置を取得してセットする
    const rect = this.refImage.getBoundingClientRect();

    this.mesh.scale.x = rect.width;
    this.mesh.scale.y = rect.height;

    //window座標をWebGL座標に変換
    const x = rect.left - sizes.width / 2 + rect.width / 2;
    const y = -rect.top + sizes.height / 2 - rect.height / 2;
    this.mesh.position.set(x, y, this.mesh.position.z);
  }

  update(offset) {
    this.setParams();
    this.mesh.material.uniforms.uTime.value = offset;
  }
}
 
//Meshを生成する用の関数
const createMesh = (geometry,material) => {
  //メッシュ化
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

//materialを生成する用の関数(uniformsの値を引数によって変更する目的)
const createMaterial = (img, index) => {

  const texture = new THREE.TextureLoader().load(img.src);
  uniforms = {
    uTexture: { value: texture },
    uImageAspect: { value: img.naturalWidth / img.naturalHeight }, // 元画像のアスペクト比
    uPlaneAspect: { value: img.clientWidth / img.clientHeight }, // 画像描画サイズのアスペクト比
    uTime: { value: 0 },
  };

  //マテリアルを定義
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById("v-shader-img").textContent,
    fragmentShader: document.getElementById("f-shader-img").textContent,
  });
  return material;
}

const imagePlaneArray = [];//テクスチャを適応したPlaneオブジェクトの配列
//アニメーション実行用関数
function animate() {
  updateScroll();
  for (const plane of imagePlaneArray) {
    plane.update(scrollOffset);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//DOMのimg要素を配列で取得
const imageArray = [...document.querySelectorAll('.js-disImg')];

const main = () =>{
  window.addEventListener('load', () => {
    //imgタグの数だけループを回して、順番にtextureを読み込みmeshを生成
    for (let i = 0; i < imageArray.length; i++) {
      geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
      const img = imageArray[i];
      const material = createMaterial(img, i);
      const mesh = createMesh(geometry, material);
      scene.add(mesh);
      const imagePlane = new ImagePlane(mesh, img);
      imagePlane.setParams();
      imagePlaneArray.push(imagePlane);
    }
    animate();
  })
}

//リサイズ対応関数
function onWindowResize() {
  sizes = {
    width: innerWidth,
    height: innerHeight,
  };
  // カメラの距離を計算し直す
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  
  // カメラの距離を計算し直す
  const fov = 60;
  const fovRad = (fov / 2) * (Math.PI / 180);
  const dist = sizes.height / 2 / Math.tan(fovRad);
  camera.position.z = dist;
}

init();
main();

//スクロール量に応じてアニメーションさせる
let targetScrollY = 0; // 本来のスクロール位置
let currentScrollY = 0; // 線形補間を適用した現在のスクロール位置
let scrollOffset = 0; // 上記2つの差分

// 開始と終了をなめらかに補間する関数
const lerp = (start, end, multiplier) => {
  return (1 - multiplier) * start + multiplier * end;
};

const updateScroll = () => {
  // スクロール位置を取得
  targetScrollY = document.documentElement.scrollTop;
  // リープ関数でスクロール位置をなめらかに追従
  currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);
  scrollOffset = targetScrollY - currentScrollY;
};
}

//テキストアニメーション
const animeStart = innerHeight - 100; //開始位置
const animeEnd = innerHeight - 300; //終了位置
const scrubNum = 1; //アニメーションを指定秒の間実行させる
function scaleIn() {
  //下から縮小しながら
  const scaleInBtTEls = document.querySelectorAll(".js-scaleInBtT");
  scaleInBtTEls.forEach(BtTel => {
    gsap.from(BtTel, {
      scrollTrigger: {
        trigger: BtTel,
        start: `top ${animeStart}px`,
        end: `top ${animeEnd}px`,
        scrub: scrubNum,
      },
      y: -100,
      opacity: 0,
      scale: 2,
    });
  });
  

  const scaleInBtTYEls = document.querySelectorAll(".js-scaleInBtTY");

  scaleInBtTYEls.forEach(BtTYel => {
    gsap.from(BtTYel, {
      scrollTrigger: {
        trigger:BtTYel,
        start: `top ${animeStart}px`,
        end: `top ${animeEnd}px`,
        scrub: scrubNum,
      },
      y:150,
      scaleY:1.5,
      opacity: 0,
    })
  })
}

