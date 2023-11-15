function addone(id) {
  var elem = document.getElementById(id);
  var presnt = parseInt(elem.value) || 0;
  elem.value = presnt + 1;
}

// 借用一下你的文件，放个机器人
import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let container,
  stats,
  clock,
  gui,
  mixer,
  actions,
  activeAction,
  previousAction,
  actionIndex = 1;
let camera, scene, renderer, model, face;
const states = [
  "Idle",
  "Walking",
  "Running",
  "Dance",
  "Death",
  "Sitting",
  "Standing",
];

const api = { state: "Walking" };

init();
animate();

function init() {
  const wrap = document.querySelector(".robot");
  wrap.addEventListener("click", changeAction);
  container = document.createElement("div");
  wrap.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    100
  );
  camera.position.set(-3, 1, 9);
  camera.lookAt(0, 3, 0);

  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0x121212 );
  scene.background = null;
  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
  clock = new THREE.Clock();

  // lights

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(0, 20, 10);
  scene.add(dirLight);

  // ground

  // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
  // mesh.rotation.x = - Math.PI / 2;
  // scene.add( mesh );

  // const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add( grid );

  // model

  const loader = new GLTFLoader();
  loader.load(
    "./assets/glb/RobotExpressive.glb",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      createGUI(model, gltf.animations);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(1920, 1000);
  container.appendChild(renderer.domElement);
  renderer.setClearAlpha(0);

  // window.addEventListener( 'resize', onWindowResize );

  // stats
  // stats = new Stats();
  // container.appendChild( stats.dom );
}

function createGUI(model, animations) {
  const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];

  // gui = new GUI();

  mixer = new THREE.AnimationMixer(model);

  actions = {};

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;

    if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

  // states

  // const statesFolder = gui.addFolder( 'States' );

  // const clipCtrl = statesFolder.add( api, 'state' ).options( states );

  // clipCtrl.onChange( function () {

  //     fadeToAction( api.state, 0.5 );

  // } );

  // statesFolder.open();

  // emotes

  // const emoteFolder = gui.addFolder( 'Emotes' );

  // function createEmoteCallback( name ) {

  //     api[ name ] = function () {

  //         fadeToAction( name, 0.2 );

  //         mixer.addEventListener( 'finished', restoreState );

  //     };

  //     emoteFolder.add( api, name );

  // }

  // function restoreState() {

  //     mixer.removeEventListener( 'finished', restoreState );

  //     fadeToAction( api.state, 0.2 );

  // }

  // for ( let i = 0; i < emotes.length; i ++ ) {

  //     createEmoteCallback( emotes[ i ] );

  // }

  // emoteFolder.open();

  // expressions

  // face = model.getObjectByName( 'Head_4' );

  // const expressions = Object.keys( face.morphTargetDictionary );
  // const expressionFolder = gui.addFolder( 'Expressions' );

  // for ( let i = 0; i < expressions.length; i ++ ) {

  //     expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );

  // }

  activeAction = actions[states[actionIndex]];
  activeAction.play();

  // expressionFolder.open();
}

function fadeToAction(name, duration) {
  previousAction = activeAction;
  activeAction = actions[name];

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  const dt = clock.getDelta();

  if (mixer) mixer.update(dt);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

function changeAction() {
  fadeToAction(states[++actionIndex % states.length], 0.2);
}

function changecolor() {
  let button = document.getElementById("num2"); // access the button by id
  let color = button.style.color;
  if (color == "red") {
    // if button color is red change it green otherwise change it to red.
    button.style.color = "green";
  } else {
    button.style.color = "red";
  }
}
