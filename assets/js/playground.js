import * as THREE from "//unpkg.com/three@0.148.0/build/three.module.js";

let mediaQueryPCLarge, mediaQueryPC, mediaQueryTablet, mediaQueryMobile, mediaFlag; //メディアクエリ用変数
let canvasHeight = innerHeight;

window.addEventListener('DOMContentLoaded', function () {
  gsap.set('.p-playground__item', {
    opacity: 0,
    y: 20
  });
  mvAnime();
})

function mvAnime() {
  const tl = gsap.timeline();
  tl.fromTo('.p-playground__item', {
    y: 20,
    opacity: 0
  }, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "Power4.easeInOut",
    stagger: {
      from: "start",
      amount: "0.6",
    },
  });
  tl.fromTo(".l-globalNav", {
    y: -30,
    opacity:0,
  }, {
    y: 0,
    opacity:1,
    duration: 3,
    ease: "Power4.easeInOut",
  },"-=1")
}

mediaQueryFunc();
secFunc();

//メディアクエリ用関数
function mediaQueryFunc() {
  mediaFlag;
  mediaQueryPCLarge = window.matchMedia("(min-width:1280px)");
  mediaQueryPC = window.matchMedia("(min-width:1024px) and (max-width:1279px)");
  mediaQueryTablet = window.matchMedia(
    "(max-width:1023px) and (min-width:769px)"
  );
  mediaQueryMobile = window.matchMedia("(max-width:768px)");

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

function secFunc() {
  //初回ロード時
  if(mediaFlag === "pcL"){
    canvasHeight = innerHeight;
  }else if (mediaFlag === "pc") {
    //pcサイズ(1024px以上)
    canvasHeight = innerHeight;
  } else if (mediaFlag === "tablet") {
    canvasHeight = innerHeight;
    //タブレットサイズ(768px以上1024px未満)
  } else if (mediaFlag === "mobile") {
    canvasHeight = innerHeight / 2;
    //モバイルサイズ(768px未満)
  }
}


class HovEffect {
  constructor(container, itemsWrapper) {
    this.container = container; //レンダリング領域
    this.itemsWrapper = itemsWrapper;
    if (!this.container || !this.itemsWrapper) return; //定義されていなければreturn
    this.setup();
    //imgのロードが完了したら処理実行
    if(mediaFlag === "pc" || mediaFlag === "tablet" || mediaFlag === "pcL"){
      this.initEffectShell().then(() => {
        console.log('load finished');
        this.isLoaded = true;
        if (this.isMouseOver) this.onMouseOver(this.tempItemIndex)
        this.tempItemIndex = null
      });
    }
    this.createEventsListeners();
  }

  setup() {
    //リサイズ用関数実行
    window.addEventListener('resize', this.onWindowResize.bind(this));
    //シーンを定義
    this.scene = new THREE.Scene();

    //カメラを定義
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.viewport.aspectRatio,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 3)

    //レンダラーを定義
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);//body直下にcanvasを追加
    this.renderer.domElement.classList.add('js-hovCanvas');

    //animationLoop
    // this.renderer.setAnimationLoop(this.render.bind(this));
    this.loopFunc(this.render.bind(this));

    //カーソル座標格納用
    this.mouse = new THREE.Vector2();
  }

  //animationLoop用(nullを渡すとloop終了)
  loopFunc(func){
    this.renderer.setAnimationLoop(func);
  }

  //レンダリング
  render() {
    this.renderer.render(this.scene,this.camera);
  }

  //viewportサイズとアスペクト比を取得
  get viewport() {
    let width = this.container.clientWidth;
    let height = canvasHeight;
    let aspectRatio = width / height;
    return {
      width,
      height,
      aspectRatio,
    };
  }

  //リサイズ対応
  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  //imgを配列で取得(this.itemsの中身)
  get itemsElements() {
    const items = [...this.itemsWrapper.querySelectorAll('.js-hovLink')];

    return items.map((item, index) => ({
      element: item,
      img: item.querySelector('img') || null,
      index: index,
    }));
  }

  initEffectShell() {
    let promises = [];

    this.items = this.itemsElements;
    const loader = new THREE.TextureLoader();
    this.items.forEach((item, index) => {
      promises.push(
        this.loadTexture(
          loader,
          item.img ? item.img.src : null,
          index
        )
      )
    });

    return new Promise((resolve, reject) => {
      // resolve textures promises
      Promise.all(promises).then(promises => {
        // all textures are loaded
        promises.forEach((promise, index) => {
          // assign texture to item
          this.items[index].texture = promise.texture
        })
        resolve();
      })
    })
  }

  loadTexture(loader, url, index) {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve({ texture: null, index })
        return
      }
      // テクスチャの読み込み
      loader.load(
        url,
  
        //ロード完了後callback
        texture => {
          resolve({ texture, index })
        },
  
        // onProgress callback currently not supported
        undefined,
  
        //読み込みエラー時callback
        error => {
          console.error('An error happened.', error)
          reject(error)
        }
      )
    })
  }

  //マウスイベントを発火させる用メソッド
  createEventsListeners(){
    //linkにホバーした時にonMouseOverを発火
    //769px以上で発火。それ以下はreturn
    if(mediaFlag === "pc" || mediaFlag === "tablet" || mediaFlag === "pcL"){
      this.items.forEach((item,index)=>{
        item.element.addEventListener('mouseover',
        this._onMouseOver.bind(this,index),false)
      });
  
      //ページ上でカーソルが動いた時、onMouseMoveを発火
      this.container.addEventListener('mousemove',this._onMouseMove.bind(this),false);
  
      //linkエリアからカーソルが出た時にonMouseLeveを発火
      this.itemsWrapper.addEventListener('mouseleave',this._onMouseLeave.bind(this),false);
    }
  }

   //コンテナからマウスが出た時の処理
   _onMouseLeave(event){
    this.isMouseOver = false;
    this.onMouseLeave(event);
  }

  //コンテナ上のカーソル座標を取得
  _onMouseMove(event){
    this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1;
    this.mouse.y = (event.clientY / this.viewport.height) * 2 - 1;
    this.onMouseMove(event);
  }
  
  _onMouseOver(index,event){
    this.tempItemIndex = index;
    this.onMouseOver(index,event);
  }

  onUpdate() {}

  onMouseEnter(event) {}

  onMouseLeave(event) {}

  onMouseMove(event) {}

  onMouseOver(index, event) {}

  //ビューポート上のカーソル座標とシーン内のカーソル座標を一致させる
  get viewSize(){
    let distance = this.camera.position.z;
    let vFov = (this.camera.fov * Math.PI) / 180;
    let height = 2 * Math.tan(vFov / 2) * distance;
    let width = height * this.viewport.aspectRatio;
    return { width,height,vFov};
  }
}


class HovEffectStretch extends HovEffect{
  constructor(container,itemsWrapper,options={}) {
    super(container, itemsWrapper);
    if (!this.container || !this.itemsWrapper) return;
    options.strength = options.strength || 0.25;
    this.options = options;
    this.init();
    if(mediaFlag === "mobile"){
      this.onScrollTargetChange();
    }
  }
  
  //planeの生成、シェーダーの読み込み
  init() {
    this.position = new THREE.Vector3(0, 0, 0);
    this.scale = new THREE.Vector2(1, 1, 1);
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    this.uniforms = {
      uTexture: {
        value:null,
      },
      uOffset: {
        value:new THREE.Vector2(0.0,0.0)
      },
      uAlpha: {
        value:0
      }
    }
    this.material = new THREE.ShaderMaterial({
      uniforms:this.uniforms,
      vertexShader: document.getElementById('vertex-pc').textContent,
      fragmentShader: document.getElementById('fragment-pc').textContent,
      transparent: true
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }
  
  onMouseEnter(){
    // ホバーしてるリンクがない時、もしくは
    if(!this.currentItem || !this.isMouseOver){
      this.isMouseOver = true;
      gsap.to(this.uniforms.uAlpha,{
        value:1.0,
        ease:"Power4.easeOut",
        duration:0.5
      })
    }
  };
  
  onMouseLeave(event){
    gsap.to(this.uniforms.uAlpha,{
      value:0.0,
      duration:0.5,
      ease:"Power4.easeOut"
    })
  }
  
  onMouseOver(index,e){
    if(!this.isLoaded) return;
    this.onMouseEnter();
    //同じリンクにホバーした時はreturn
    if(this.currentItem && this.currentItem.index === index) return;
    this.onTargetChange(index);
  }
  
  //ホバーしているリンクが変わったらロードするtextureを変える関数
  onTargetChange(index){
    this.currentItem = this.items[index];
    if(!this.currentItem.texture) return;
    this.uniforms.uTexture.value = this.currentItem.texture;
    let shrinkRate = 0.8;//縮小率
    
    let imageRatio = (this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight) * shrinkRate ;
    
    this.scale = new THREE.Vector3(imageRatio,shrinkRate,1.0);
    this.plane.scale.copy(this.scale);
  }
  
  onMouseMove(event){
    Number.prototype.map = function(in_min, in_max, out_min, out_max) {
      return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    }
    let x = this.mouse.x.map(-1,
      1,
      -this.viewSize.width / 2,
      this.viewSize.width / 2);
      let y = -this.mouse.y.map(-1,1,-this.viewSize.height / 2,
      this.viewSize.height / 2);
      
      this.position = new THREE.Vector3(x,y,0);
      gsap.to(this.plane.position,{
        x:x,
        y:y,
        ease: "Power4.easeOut",
        duration:1.0,
        onUpdate:this.onPositionUpdate.bind(this)
      })
    }

    onScrollTargetChange(){
      this.items = this.itemsElements;
      this.uniforms.uAlpha.value = 1.0;
      let currentImg = this.items[0].img;
      let currentImgSrc = currentImg.src;
      const targetEls = document.querySelectorAll('.js-hovList');
      const targetElPos = targetEls[0].clientHeight;
      const playground = document.querySelector('.js-itemsWrapper');
      let fragLine = innerHeight / 2 + 1;//canvasの下にピッタリつくライン

      //リストが最後まで表示できるようにするために、空のliを2個appendする
      const adjustList = document.createElement('li');
      const adjustList2 = document.createElement('li');
      adjustList.classList.add('p-playground__item');
      adjustList2.classList.add('p-playground__item');

        //liを2個appendする(一番下の要素までアクティブにできるように)
        playground.appendChild(adjustList);
        playground.appendChild(adjustList2);

        //スクロール量に応じてアニメーションさせる
        let targetScrollY = 0; // 本来のスクロール位置
        let currentScrollY = 0; // 線形補間を適用した現在のスクロール位置
        let scrollOffset = 0; // 上記2つの差分
        // 開始と終了をなめらかに補間する関数
        const lerp = (start, end, multiplier) => {
          return (1 - multiplier) * start + multiplier * end;
        };

        this.updateMobile(scrollOffset);
        
        this.uniforms.uTexture.value = new THREE.TextureLoader().load(currentImgSrc);
        playground.addEventListener('scroll',function(){
          targetScrollY = playground.scrollTop;
          // リープ関数でスクロール位置をなめらかに追従
          currentScrollY = lerp(currentScrollY, targetScrollY,0.2);
          scrollOffset = targetScrollY - currentScrollY;
          this.uniforms.uTime.value = scrollOffset;
        }.bind(this));
        
        
        //js-hovListのNodeListにループ文
        targetEls.forEach(target=>{
          let targetPos = target.getBoundingClientRect().top;
          let targetClass = target.classList;
          
          let shrinkRate = 1.3;//縮小率
          
          let imageRatio = (currentImg.naturalWidth / currentImg.naturalHeight) * shrinkRate ;
          
          this.scale = new THREE.Vector3(imageRatio,shrinkRate,1.0);
          this.plane.scale.copy(this.scale);
          //.js-itemsWrapperをスクロールしたときに発火
          playground.addEventListener('scroll',function(){

          targetPos = target.getBoundingClientRect().top;
          //targetの画面上部からの距離がcanvasの下の位置と一致した時
          if(targetPos <= fragLine + 50 && targetPos >=  fragLine - 30 ){
            targetClass.add('is-view');
            currentImg = target.querySelector('img');
            currentImgSrc = currentImg.src;
            this.uniforms.uTexture.value = new THREE.TextureLoader().load(currentImgSrc);
            imageRatio = (currentImg.naturalWidth / currentImg.naturalHeight) * shrinkRate ;
            this.scale = new THREE.Vector3(imageRatio,shrinkRate,1.0);
            this.plane.scale.copy(this.scale);
          }else{
            if(targetClass.contains('is-view') === true){
              targetClass.remove('is-view');
            }
          }
        }.bind(this));
      });
    };

    updateMobile(offset) {
      this.uniforms = {
        uTexture: {
          value:null,
        },
        uTime: {
          value:0
        },
      }
      this.material.uniforms = this.uniforms;
      this.material.vertexShader = document.getElementById('vertex-sp').textContent;
      this.material.fragmentShader = document.getElementById('fragment-sp').textContent;
    }
    
    onPositionUpdate(){
      let offset = this.plane.position
      .clone()
      .sub(this.position) // velocity
      .multiplyScalar(-this.options.strength)
      this.uniforms.uOffset.value = offset
    }
  }
  
  const container = document.body;
  const itemsWrapper = document.querySelector('.js-itemsWrapper');

// Preload images
  let effect = new HovEffectStretch(container, itemsWrapper);

