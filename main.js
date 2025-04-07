import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

// Get HTML elements
const canvas = document.getElementById('three-canvas');
const logoAnimation = document.getElementById('logoAnimation');
const secondSceneContent = document.getElementById('secondSceneContent'); 
const thirdSceneContent = document.getElementById('thirdSceneContent');
const fourthSceneContent = document.getElementById('fourthSceneContent');
const fifthSceneContent = document.getElementById('fifthSceneContent');
const sixthSceneContent = document.getElementById('sixthSceneContent');
const seventhSceneContent = document.getElementById('seventhSceneContent');

// Create the Three.js scene
const scene = new THREE.Scene();

// Define scene positions and rotations
const scenes = [
  { position: { x: -30.6711, y: -130.928, z: 40.7944 }, rotation: { x: 1.5762, y: -0.0045, z: 2.4401 } },
  { position: { x: 6.6714, y: 23.928, z: 20.2791 }, rotation: { x: -0.8466, y: 0.2146, z: 0.2363 } },
  { position: { x: -2.3276, y: 2.3332, z: 19.0066 }, rotation: { x: -0.0700, y: -0.1216, z: -0.0085 } },
  { position: { x: 9.2312, y: 2.9214, z: 5.8142 }, rotation: { x: -0.3192, y: 0.9851, z: 0.2687 } },
  { position: { x: -21.5715, y: 7.0418, z: -14.6369 }, rotation: { x: -2.7501, y: -0.9376, z: -2.8204 } },
  { position: { x: 8.3085, y: 4.5878, z: -14.1702 }, rotation: { x: -2.8936, y: 0.5169, z: 3.0171 } },
  { position: { x: 14.8131, y: 27.0571, z: -10.8962 }, rotation: { x: -1.9669, y: 0.4830, z: 2.3038 } }
];

// Set up camera and renderer
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight1.position.set(5, 10, 7.5);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-5, -10, -7.5);
scene.add(directionalLight2);

// Load 3D model
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

// Set initial scene parameters
let currentScene = 0;
let isTransitioning = false;
const initialScene = scenes[0];
camera.position.set(initialScene.position.x, initialScene.position.y, initialScene.position.z);
camera.rotation.set(initialScene.rotation.x, initialScene.rotation.y, initialScene.rotation.z);

// Hide all scene-specific content except the first one
seventhSceneContent.style.display = "none";
sixthSceneContent.style.display = "none";
fifthSceneContent.style.display = "none";
fourthSceneContent.style.display = "none";
thirdSceneContent.style.display = "none";
secondSceneContent.style.display = "none";
logoAnimation.style.display = "block";

// Transition function for smooth camera movement
function transitionToScene(targetScene, fastTransition = false) {
  if (isTransitioning) return;
  isTransitioning = true;
  const duration = fastTransition ? 0.1 : 1.5;

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

// Update scene content visibility based on the current scene
function updateSceneVisibility() {
  logoAnimation.style.display = currentScene === 0 ? "block" : "none";
  secondSceneContent.style.display = currentScene === 1 ? "block" : "none";
  thirdSceneContent.style.display = currentScene === 2 ? "block" : "none";
  fourthSceneContent.style.display = currentScene === 3 ? "block" : "none";
  fifthSceneContent.style.display = currentScene === 4 ? "block" : "none";
  sixthSceneContent.style.display = currentScene === 5 ? "block" : "none";
  seventhSceneContent.style.display = currentScene === 6 ? "block" : "none";
}

// Incremental smooth transition (used for wheel scroll events)
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
    updateSceneVisibility();
    setTimeout(stepThroughScenes, 500);
  };
  stepThroughScenes();
}

// Update navigation link states
function updateActiveNavLink(targetIndex) {
  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach((link) => {
    link.classList.remove('active');
  });
  navLinks.forEach((link) => {
    if (parseInt(link.getAttribute('data-target')) === targetIndex) {
      link.classList.add('active');
    }
  });
}

// For navbar clicks we want a direct jump without stepping through intermediate scenes.
function jumpToScene(targetIndex) {
  if (targetIndex < 0 || targetIndex >= scenes.length) return;
  updateActiveNavLink(targetIndex);
  currentScene = targetIndex;
  updateSceneVisibility();
  // Animate directly to the target scene (non-fast transition)
  transitionToScene(scenes[targetIndex]);
}

// Navigation click event listener using direct jump
document.querySelectorAll('.navbar a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetIndex = parseInt(link.getAttribute('data-target'));
    jumpToScene(targetIndex);
  });
});

// 🟡 Itinerary Hover + Scroll Behavior
let isHoveringItinerary = false;
const itineraryContainer = document.querySelector('.itinerary-container');

itineraryContainer.addEventListener('mouseenter', () => {
  isHoveringItinerary = true;
});

itineraryContainer.addEventListener('mouseleave', () => {
  isHoveringItinerary = false;
});

// 🟢 Scroll inside Itinerary Container (assuming itinerary is scene 3)
itineraryContainer.addEventListener('wheel', (event) => {
  if (window.innerWidth <= 1000 && currentScene === 3) {
    const delta = event.deltaY;
    if (itineraryContainer.scrollHeight > itineraryContainer.clientHeight) {
      event.preventDefault();
      itineraryContainer.scrollTop += delta;
    }
  }
}, { passive: false });

// 🟠 FAQ Hover + Scroll Behavior
let isHoveringFaq = false;
const faqContainer = document.querySelector('.faq-container'); // Ensure your FAQ box uses this class

faqContainer.addEventListener('mouseenter', () => {
  isHoveringFaq = true;
});

faqContainer.addEventListener('mouseleave', () => {
  isHoveringFaq = false;
});

// Scroll inside FAQ container
faqContainer.addEventListener('wheel', (event) => {
  if (faqContainer.scrollHeight > faqContainer.clientHeight) {
    event.preventDefault();
    faqContainer.scrollTop += event.deltaY;
  }
}, { passive: false });

// 🔵 Global scroll event listener for scene transitions (one scene at a time)
window.addEventListener('wheel', (event) => {
  if (isTransitioning) return;

  // Prevent scene transitions when hovering over FAQ or itinerary (on mobile for itinerary)
  if (isHoveringFaq) return;
  if (currentScene === 3 && isHoveringItinerary && window.innerWidth <= 1000) return;

  if (event.deltaY > 0 && currentScene < scenes.length - 1) {
    currentScene++;
    transitionToScene(scenes[currentScene]);
    updateSceneVisibility();
    updateActiveNavLink(currentScene);
  } else if (event.deltaY < 0 && currentScene > 0) {
    currentScene--;
    transitionToScene(scenes[currentScene]);
    updateSceneVisibility();
    updateActiveNavLink(currentScene);
  }
}, { passive: false });

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Mobile device check
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  document.getElementById('mobileWarning').style.display = 'flex';
}

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbarMenu');

hamburger.addEventListener('click', () => {
  navbarMenu.classList.toggle('show');
});
