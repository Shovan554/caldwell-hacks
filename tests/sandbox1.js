import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const sceneOverlay = document.getElementById('scene-overlay'); // Reference to the overlay element

// Array of scene positions and rotations
const scenes = [
  { position: { x: 9.243847017032264, y: 27.221735894078613, z: 19.035540084340727 }, rotation: { x: -0.9428689439026954, y: 0.27789871023187823, z: 0.36131184109872777 } },
  { position: { x: 8.933205847690104, y: 3.8819530765668917, z: 17.3805364698022 }, rotation: { x: -0.16431988212140283, y: 0.46927503539621185, z: 0.07484804331236386 } },
  { position: { x: -27.097473178657093, y: 2.5205593059290363, z: -9.784298656230128 }, rotation: { x: -2.9874178484961704, y: -1.2204577767663, z: -2.996648214188409 } },
  { position: { x: 4.17797803576046, y: 2.197691819303569, z: -9.446499163434153 }, rotation: { x: -3.0154786932285096, y: 0.4134720768483506, z: 3.0906948084949657 } },
  { position: { x: 0.5505911747231215, y: 22.0898390832435, z: -19.416553733427953 }, rotation: { x: -2.3149087963606334, y: 0.019204236468850763, z: 3.1207377350283183 } },
  { position: { x: 16.889012714080636, y: 25.291726316528187, z: -12.972649475691192 }, rotation: { x: -2.0613003318938476, y: 0.5501298074818266, z: 2.3668275781475945 } }
];

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const firstScene = scenes[0];
camera.position.set(firstScene.position.x, firstScene.position.y, firstScene.position.z);
camera.rotation.set(firstScene.rotation.x, firstScene.rotation.y, firstScene.rotation.z);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight1.position.set(5, 10, 7.5);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-5, -10, -7.5);
scene.add(directionalLight2);

// Load the GLB model
const loader = new GLTFLoader();
loader.load(
  '/3Dmodels/wanderers.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error);
  }
);

// Current scene index
let currentScene = 0;
let isTransitioning = false;

// Function to smoothly transition to the target camera position and rotation
function transitionToScene(target, sceneIndex) {
  isTransitioning = true;

  // Update the scene overlay text
  sceneOverlay.innerText = `Scene ${sceneIndex + 1}`;

  // Smoothly animate the camera position
  gsap.to(camera.position, {
    x: target.position.x,
    y: target.position.y,
    z: target.position.z,
    duration: 1.5,
    onComplete: () => {
      isTransitioning = false;
    }
  });

  // Smoothly animate the camera rotation
  gsap.to(camera.rotation, {
    x: target.rotation.x,
    y: target.rotation.y,
    z: target.rotation.z,
    duration: 1.5
  });
}

// Initialize to the first scene on load
transitionToScene(scenes[0], 0);

// Scroll event handler to navigate scenes
window.addEventListener('wheel', (event) => {
  if (isTransitioning) return;

  if (event.deltaY > 0 && currentScene < scenes.length - 1) {
    currentScene++;
    transitionToScene(scenes[currentScene], currentScene);
  } else if (event.deltaY < 0 && currentScene > 0) {
    currentScene--;
    transitionToScene(scenes[currentScene], currentScene);
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Ensure renderer resizes with the window
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



//const scenes = [
//   { position: { x: 0.20611212223087194, y: 0.9650294440247871, z: 1.4969972773758096 }, rotation: { x: 0.02335621935207296, y: 0.13678659422824802, z: -0.003185432684706401 } },
//   { position: { x: -0.013239139504127233, y: 0.9964704100467455, z: -0.05369955515849102 }, rotation: { x: 3.0759585865171553, y: -0.24121996651100897, z: 3.1258922356860532 } },
//   { position: { x: 4.637573427070608, y: 1.4097870517512647, z: -2.89336839678049 }, rotation: { x: -3.0008986470627947, y: 1.0085212803559862, z: 3.0223361818017263 } },
//   { position: { x: -0.9127258779958526, y: 1.0142212181092187, z: -7.628144348892761 }, rotation: { x: -3.1397283467567254, y: -0.11908605413484315, z: -3.141371164766067 } },
//   { position: { x: -2.652494104431646, y: 0.810863253169462, z: 4.8497199196067795 }, rotation: { x: 0.038979765307747265, y: -0.5001691357432059, z: 0.018700973740852306 } }
// ];
