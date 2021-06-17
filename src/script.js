import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

import * as dat from 'dat.gui';

// Debug
const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0D0E22');

// Axis helper
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

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

// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Material
// Steph color: B7E4F4 ... 186691
// gl_FragColor = vec4(0.718, 0.894, 0.957, 1.0);
// debugObject.depthColor = '#b7e4f4';
// debugObject.surfaceColor = '#9bd8ff';
debugObject.depthColor = '#288fcc';
debugObject.surfaceColor = '#b7e4f4';

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms:
  {
    uTime: {value: 0},
    uBigWavesElevation: {value: 0.193},
    uBigWavesFrequency: {value: new THREE.Vector2(1, .375)},
    uBigWavesSpeed: {value: 0.75},
    uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
    uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
    uColorOffset: {value: 0.08},
    uColorMultiplier: {value: 5},
    uSmallWavesElevation: {value: 0.15},
    uSmallWavesFrequency: {value: 10},
    uSmallWavesSpeed: {value: 0.02},
    uSmallIterations: {value: 1},
  },
});

waterMaterial.metalness = 0.45;
waterMaterial.roughness = 0.65;

// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
// gui.addColor(debugObject, 'depthColor').onChange(() => {
//   waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
// });
// gui.addColor(debugObject, 'surfaceColor').onChange(() => {
//   waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
// });

// Water Test Mesh
// const water = new THREE.Mesh(waterGeometry, waterMaterial);
// water.rotation.x = - Math.PI * 0.5;
// water.position.y = 2;
// scene.add(water);

// Light
// const light1 = new THREE.PointLight( 0xff2200, 0.7 );
// light1.position.set( 100, 100, 100 );
// scene.add( light1 );

// const light2 = new THREE.PointLight( 0x22ff00, 0.7 );
// light2.position.set( - 100, - 100, - 100 );
// scene.add( light2 );

scene.add( new THREE.AmbientLight( 0x111111, 1 ) );

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
camera.position.y = 1;
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

// Universal Axion
// const bakedTexture = textureLoader.load('universalAxion1.bin');
const normalMaterial = new THREE.MeshNormalMaterial();
normalMaterial.shininess = 100;
normalMaterial.specular = new THREE.Color(0x1188ff);
const gltfLoader = new GLTFLoader();
let mixer = null;
gltfLoader.load(
    '/models/AnimatedAxion/universalAxion0.gltf',
    (gltf) => {
      console.log('🙏🏻', gltf);
      const bScene = gltf.scene || gltf.scenes[0];
      bScene.scale.set(2, 2, 2);
      bScene.traverse((child) => {
        // Add material for the light sabers and material for the sphere
        if (child.name.includes('Cone')) {
          console.log('cone child', child);
          child.material = normalMaterial;
        }
        child.material = waterMaterial;
      });
      scene.add(bScene);
      mixer = new THREE.AnimationMixer(bScene);
      gltf.animations.forEach((ani) => {
        const action = mixer.clipAction(ani);
        action.play();
      });
    },
);

// Animate
const clock = new THREE.Clock();
let previousTime = 0;
const randArr = ['a', 'b', 'c'].map((r) => Math.floor(Math.random() * 360));

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update objects
  waterMaterial.uniforms.uTime.value = elapsedTime;
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

