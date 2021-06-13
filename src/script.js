import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

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

// Background stars
const particlesGeometry = new THREE.BufferGeometry();
const count = 500;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/9.png');
const lightConeTexture = textureLoader.load('/textures/matcaps/11.png');

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

// Universal Axion
const gltfLoader = new GLTFLoader();
let mixer = null;
gltfLoader.load(
    '/models/UniversalAxion/universalAxion2.gltf',
    (gltf) => {
      scene.add(gltf.scene);
      mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    },
);


// Ergosphere
const materialErgo = new THREE.MeshBasicMaterial({color: '#6F09D4'});
const ergosphere = new THREE.Mesh( new THREE.TorusGeometry(2.75, .01, 55, 55), materialErgo);
ergosphere.rotation.x = Math.PI * 0.5;

// Lightcone Group
const lightConeGroup = new THREE.Group();
const materialLightcone = new THREE.MeshMatcapMaterial({matcap: lightConeTexture});

const lightCone1 = new THREE.Mesh( new THREE.ConeGeometry(.10, .35, 30), materialLightcone);
const lightCone2 = new THREE.Mesh( new THREE.ConeGeometry(.10, .35, 30), materialLightcone);
const lightCone3 = new THREE.Mesh( new THREE.ConeGeometry(.10, .35, 30), materialLightcone);
const lightCone4 = new THREE.Points(new THREE.ConeGeometry(.10, .35, 30), particlesMaterial);

lightConeGroup.add(lightCone1, lightCone2, lightCone3, lightCone4);

// Add all objects
scene.add(sphere, eventHorizon, ergosphere, lightConeGroup);

// Light
const light1 = new THREE.PointLight( 0xff2200, 0.7 );
light1.position.set( 100, 100, 100 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0x22ff00, 0.7 );
light2.position.set( - 100, - 100, - 100 );
scene.add( light2 );

scene.add( new THREE.AmbientLight( 0x111111 ) );

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
let previousTime = 0;
const randArr = ['a', 'b', 'c'].map((r) => Math.floor(Math.random() * 360));

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update objects
  sphere.rotation.y = 0.2 * elapsedTime;
  eventHorizon.rotation.z = 0.2 * elapsedTime;
  lightConeGroup.children.forEach((child, index) => {
    const spotX = Math.sin(0.2 * (elapsedTime + randArr[index])) * 2.75;
    const spotZ = Math.cos(0.2 * (elapsedTime + randArr[index])) * 2.75;
    child.position.x = spotX;
    child.position.z = spotZ;
    child.rotation.order = 'YXZ';
    child.rotation.y = (0.2 * (elapsedTime + randArr[index]) + (Math.PI / 2));
    child.rotation.x = (Math.PI/2);
    child.rotation.z = Math.PI;
  });

  // Update UA
  if (mixer) {
    mixer.update(deltaTime);
  }

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

