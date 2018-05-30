# Interactive Graphics

## Homework 1 - 3D Cube

1 - Add a button that changes the direction of the current rotation.

2 - Move the transformations matrices from the shader to the Javascript application, so that the ModelView and Projection matrix are computed in the application and then transferred to the shader.

3 - Include a scaling (uniform, all parameters have the same value) and a translation Matrix and control them with sliders.

4 - Define an orthographic projection with the planes near and far controlled by sliders.

5 - Define a perspective projection, introduce a button that switches between orthographic and perspective projection. The slider for near and far should work for both projections.

6 - Introduce a light source, replace the colors by the properties of the material (your choice) and assign to each vertex a normal.

7 - Implement both the Gouraud and the Phong shading models, with a button switching between them.

## Homework 2 - Dog Animation

1 - Create a hierarchical model of a (simplified) dog, composed of the body, 4 legs (each one composed of 2 independent components, upper and lower leg), head and tail. All components are cubes, use the cube function present in the file

2 - Add a procedural texture to the body of the dog. The texture should be a checkerboard pattern but with a linear decrease of intensity from the front to the back of the body.

3 - Add a button that starts an animation of the dog so that, starting from an initial position where it is standing and positioned along the x axis, it walks to the right by moving (alternatively back and forth) the legs and turns the head in the direction of the viewer.