// main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const canvas = document.getElementById('three-canvas');
const logoAnimation = document.getElementById('logoAnimation');
const scene = new THREE.Scene();

// Array of scene positions and rotations
const scenes = [
  { position: { x: -30.6711, y: -130.928, z: 40.7944 }, rotation: { x: 1.5762, y: -0.0045, z: 2.4401 } },
  { position: { x: 6.6714, y: 23.928, z: 20.2791 }, rotation: { x: -0.8466, y: 0.2146, z: 0.2363 } },
  { position: { x: -2.3276, y: 2.3332, z: 19.0066 }, rotation: { x: -0.0700, y: -0.1216, z: -0.0085 } },
  { position: { x: 9.2312, y: 2.9214, z: 5.8142 }, rotation: { x: -0.3192, y: 0.9851, z: 0.2687 } },
  { position: { x: -21.5715, y: 7.0418, z: -14.6369 }, rotation: { x: -2.7501, y: -0.9376, z: -2.8204 } },
  { position: { x: 8.3085, y: 4.5878, z: -14.1702 }, rotation: { x: -2.8936, y: 0.5169, z: 3.0171 } },
  { position: { x: 14.8131, y: 27.0571, z: -10.8962 }, rotation: { x: -1.9669, y: 0.4830, z: 2.3038 } }
];

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
loader.load('/3Dmodels/wanderers.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
}, undefined, (error) => console.error('An error occurred while loading the model:', error));

// Start at the first scene on load
let currentScene = 0;
let isTransitioning = false;
const initialScene = scenes[0];
camera.position.set(initialScene.position.x, initialScene.position.y, initialScene.position.z);
camera.rotation.set(initialScene.rotation.x, initialScene.rotation.y, initialScene.rotation.z);
logoAnimation.style.display = "block"; // Show the logo in the initial scene

// Transition function
function transitionToScene(targetScene, fastTransition = false) {
  if (isTransitioning) return;
  isTransitioning = true;

  const duration = fastTransition ? 0.2 : 1.5;

  gsap.to(camera.position, {
    x: targetScene.position.x,
    y: targetScene.position.y,
    z: targetScene.position.z,
    duration,
    onComplete: () => {
      isTransitioning = false;
    }
  });

  gsap.to(camera.rotation, {
    x: targetScene.rotation.x,
    y: targetScene.rotation.y,
    z: targetScene.rotation.z,
    duration
  });
}

// Update visibility based on scene
function updateLogoVisibility() {
  logoAnimation.style.display = currentScene === 0 ? "block" : "none";
}

// Smooth transition function
function smoothTransitionToTarget(targetIndex) {
  const stepThroughScenes = () => {
    if (currentScene < targetIndex) {
      currentScene++;
    } else if (currentScene > targetIndex) {
      currentScene--;
    } else {
      return;
    }
    transitionToScene(scenes[currentScene], true);
    updateLogoVisibility();
    setTimeout(stepThroughScenes, 500);
  };
  stepThroughScenes();
}

// Event listener for navbar links
document.querySelectorAll('.navbar a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetIndex = parseInt(link.getAttribute('data-target'));
    smoothTransitionToTarget(targetIndex);
  });
});

// Scroll event handler to navigate scenes
window.addEventListener('wheel', (event) => {
  if (isTransitioning) return;

  if (event.deltaY > 0 && currentScene < scenes.length - 1) {
    currentScene++;
  } else if (event.deltaY < 0 && currentScene > 0) {
    currentScene--;
  }
  transitionToScene(scenes[currentScene]);
  updateLogoVisibility();
});

// Animate and render scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Adjust camera on window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});