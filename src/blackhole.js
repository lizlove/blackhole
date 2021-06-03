import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Axis helper
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: '#F8FEC5' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = .25
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate - Use this for the lightcones
const clock = new THREE.Clock()
const tick = () =>
{
  // Time
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  mesh.position.x = Math.cos(elapsedTime)
  mesh.position.y = Math.sin(elapsedTime)

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
renderer.render(scene, camera)