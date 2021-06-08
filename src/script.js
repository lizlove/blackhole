import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0D0E22');

// Axis helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/9.png');
const lightconeTexture = textureLoader.load('/textures/matcaps/11.png');

// Objects
const materialSphere = new THREE.MeshBasicMaterial({color: 'black', wireframe: false});
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    materialSphere,
);

// Event Horizon with matcap
const materialEvHorz = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
const eventHorizon = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, .05, 45, 45),
    materialEvHorz,
);
eventHorizon.rotation.x = Math.PI * 0.5;

const materialErgo = new THREE.MeshBasicMaterial({color: '#6F09D4'});
const ergosphere = new THREE.Mesh( new THREE.TorusGeometry(2.75, .01, 45, 45), materialErgo);
ergosphere.rotation.x = Math.PI * 0.5;

// Lightcone Group
const lightconeGroup = new THREE.Group();
const materialLightcone = new THREE.MeshMatcapMaterial({matcap: lightconeTexture});

const lightCone1 = new THREE.Mesh( new THREE.ConeGeometry(.10, .35, 30), materialLightcone);
lightconeGroup.add(lightCone1);

const lightCone2 = new THREE.Mesh( new THREE.ConeGeometry(.10, .35, 30), materialLightcone);
lightconeGroup.add(lightCone2);

const lightCone3 = new THREE.Mesh( new THREE.ConeGeometry(.10, .35, 30), materialLightcone);
lightconeGroup.add(lightCone3);

scene.add(sphere, eventHorizon, ergosphere, lightconeGroup);

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
camera.position.z = 0;
camera.position.y = 5;
camera.position.x = 0;
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
const randArr = ['a', 'b', 'c'].map((r) => Math.floor(Math.random() * 360));
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update objects
  sphere.rotation.y = 0.2 * elapsedTime;
  eventHorizon.rotation.z = 0.2 * elapsedTime;
  lightconeGroup.children.forEach((child, index) => {
    // lightCone1.rotation.x = Math.PI * 0.5;
    // lightCone1.rotation.z = Math.PI * 1;
    const spotX = Math.sin(0.2 * (elapsedTime + randArr[index])) * 2.75;
    const spotZ = Math.cos(0.2 * (elapsedTime + randArr[index])) * 2.75;
    child.position.x = spotX;
    child.position.z = spotZ;
    child.rotation.x = (Math.PI * spotX) / (-1.65 * Math.PI);
    child.rotation.z = (Math.PI * spotZ) / (-1.65 * Math.PI);
    console.log(child.rotation);
  });
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
