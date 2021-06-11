# Black Hole Notes

_16 June 2021 Jim preview_
_17 June 2021 presentation_

Chern-Simons Gravity modifies the black hole solution. Rotating black holes move through the Chern-Simons gravity.
its neccessary that Black Holes rotate bc of Chern-Simons gravity.Prediction differs from normal general relativity.
in GR the only object of interest is gravitational field that warps space-time.
in C-S Gravity there is amnother physical thing called 'Universal Axion'. It's like a fluid. behaves as a fluid. fluid gets concentrated and flows along at north and south pole. Known as a Chern-Simons cap is a build up of this quantum fluid.

## 3 June 2021: Three.js

### Scene

4 elements needed for three:
  1. A scene that will contain objects
  2. Some objects
  3. A camera
  4. A renderer


### Mesh
Mesh is the combination of a geometry (the shape) and a material (how it looks).


### Camera
<!-- For BH final: can use 2 cameras to show the the top-down and the side view. only have to build once :) -->
You can have multiple cameras just like on a movie set, and you can switch between those cameras as you please. Usually, we only use one camera.

Object3D instances have an excellent method named lookAt(...) that lets you ask an object to look at something. The object will automatically rotate its -z axis toward the target you provided. No complicated maths needed. You can use it to rotate the camera toward an object, orientate a cannon to face an enemy, or move the character's eyes to an object.The parameter is the target and must be a Vector3.

I usually use a field of view between 45 and 75.

### Object Transformation
There are 4 properties to transform objects in our scene:
  1. position (to move the object)
  2. scale (to resize the object)
  3. rotation (to rotate the object)
  4. quaternion (to also rotate the object; more about that later)


### Rotation
The rotation property also has x, y, and z properties, but instead of a Vector3, it's an Euler. When you change the x, y, and z properties of an Euler, you can imagine putting a stick through your object's center in the axis's direction and then rotating that object on that stick.
- If you spin on the y axis, you can picture it like a carousel.
- If you spin on the x axis, you can imagine that you are rotating the wheels of a car you'd be in.
- And if you rotate on the z axis, you can imagine that you are rotating the propellers in front of an aircraft you'd be in.

While Euler is easier to understand, this order problem can cause issues. And this is why most engines and 3D softwares use another solution named Quaternion.

### Quaternion
The quaternion property also expresses a rotation, but in a more mathematical way, which solves the order problem.

We will not cover how quaternions work in this lesson but keep in mind that the quaternion updates when you change the rotation. This means that you can use any one of the two as you please.



## TODO:
- Fluid static
- Fluid movement
- Fluid rotation
- Lightsaber
- Inverse lightcone direction
- Lightcone color fade/gradient - make shaders
- Little stars not in front of camera.
- Labels
- Light position and shininess
- Camera movement over time / recording


## Done
- Objects: event horizon, ergosphere, lightcones
- Event horizon rotation
- Lightcones rotation direction
- Event horizon color gradient
- Lightcone height

## Vignette 1:
<!-- const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 0;
camera.position.y = 4;
camera.position.x = 0; -->


### Thanks
- Megan Bedell for color advice
- Robert Blackwell for Euler rotation