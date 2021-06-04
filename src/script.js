import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0D0E22');

// Axis helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Objects
const materialSphere = new THREE.MeshBasicMaterial({color: 'red', wireframe: true});
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    materialSphere,
);

const materialErgo = new THREE.MeshBasicMaterial({color: '#6F09D4', wireframe: true});
const ergosphere = new THREE.Mesh( new THREE.RingGeometry(1, 2, 32), materialErgo);

scene.add(sphere, ergosphere);

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = .25;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  ergosphere.rotation.x = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();

renderer.render(scene, camera);

// Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Debug
const gui = new dat.GUI();
// gui.add(ergosphere, 'innerRadius').min(0).max(1).step(0.0001);
gui.add(ergosphere, 'innerRadius');
gui.add(ergosphere, 'outerRadius');
gui.add(ergosphere, 'thetaSegments');
gui.add(ergosphere, 'phiSegments');
gui.add(ergosphere, 'thetaStart');
gui.add(ergosphere, 'thetaLength');
