import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import gsap from 'gsap';

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x15223c);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.set(0, 5, 50);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting setup with neon colors
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.8);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0x10ff84, 0.9);
directionalLight1.position.set(10, 20, 15);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0x000000, 1);
directionalLight2.position.set(-10, -15, -15);
scene.add(directionalLight2);

// Set up post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.9,
  0.6,
  0.85
);
composer.addPass(bloomPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrectionPass);

// Updated scene transitions with the provided coordinates
const scenes = [
  { position: { x: 0.00988, y: -13285.73, z: 0.00887 }, rotation: { x: 1.5708, y: 7.4e-7, z: -0.83936 } },
  { position: { x: 1016.70, y: -343.63, z: 1509.93 }, rotation: { x: 0.2244, y: 0.5809, z: -0.1246 } },
  { position: { x: -1091.08, y: 594.95, z: 1374.45 }, rotation: { x: -0.4079, y: -0.6297, z: -0.2492 } },
  { position: { x: 1271.94, y: -453.56, z: -1268.03 }, rotation: { x: 2.7974, y: 0.7567, z: -2.9003 } },
  { position: { x: 860.11, y: -58.03, z: 554.56 }, rotation: { x: 0.1060, y: 0.9955, z: -0.0891 } },
  { position: { x: -0.0066, y: 8718.42, z: 0.0057 }, rotation: { x: -1.5708, y: -7.57e-7, z: -0.8590 } },
  { position: { x: 0.00988, y: -13285.73, z: 0.00887 }, rotation: { x: 1.5708, y: 7.4e-7, z: -0.83936 } } // Return to initial scene
];

let currentScene = 0;
let isTransitioning = false;

function transitionToScene(sceneIndex) {
  if (isTransitioning || sceneIndex === currentScene) return;
  
  isTransitioning = true;
  const targetScene = scenes[sceneIndex];

  gsap.to(camera.position, {
    x: targetScene.position.x,
    y: targetScene.position.y,
    z: targetScene.position.z,
    duration: 1.5,
    ease: 'power2.inOut'
  });
  gsap.to(camera.rotation, {
    x: targetScene.rotation.x,
    y: targetScene.rotation.y,
    z: targetScene.rotation.z,
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      currentScene = sceneIndex;
      isTransitioning = false;
    }
  });
}

// Scroll event listener to navigate scenes
window.addEventListener('wheel', (event) => {
  if (event.deltaY > 0 && currentScene < scenes.length - 1) {
    transitionToScene(currentScene + 1);
  } else if (event.deltaY < 0 && currentScene > 0) {
    transitionToScene(currentScene - 1);
  }
});

// Load the GLB model with emissive neon colors
const loader = new GLTFLoader();
loader.load(
  '/3Dmodels/cyberpunk.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0x000000);
        child.material.emissiveIntensity = 0.6;
      }
    });
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
