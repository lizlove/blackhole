import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';

const parameters = {
  color: '#F8FEC5',
  spin: () => {
    gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2});
  },
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axis helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Objects

// CircleGeometry To create a disc or a portion of a disc (like a pie chart).
// ConeGeometry To create a cone or a portion of a cone. You can open or close the base of the cone.
// const geometry = new THREE.ConeGeometry(1, 1, 32);
// RingGeometry To create a flat ring or portion of a flat circle. => Ergosphere
// TorusGeometry To create a ring that has a thickness (like a donut) or portion of a ring.
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);
// SphereGeometry To create the most popular type of sphere where faces looks like quads (quads are just a combination of two triangles).
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// ExtrudeGeometry To create an extrusion based on a path. You can add and control the bevel.


const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({color: '#F8FEC5'});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = .25;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate - Use this for the lightcones
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.position.x = Math.cos(elapsedTime);
  mesh.position.y = Math.sin(elapsedTime);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
renderer.render(scene, camera);


// Debug
const gui = new dat.GUI();
gui
    .add(mesh.position, 'y')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('elevation');
gui
    .add(mesh, 'visible')
    .name('showOrb');
gui
    .add(camera.position, 'z')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('cameraZ');
gui
    .add(camera.position, 'y')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('cameraY');
gui
    .add(camera.position, 'x')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('cameraX');
gui.add(material, 'wireframe');
gui.addColor(parameters, 'color')
    .onChange(() => {
      material.color.set(parameters.color);
    });
gui.add(parameters, 'spin');
