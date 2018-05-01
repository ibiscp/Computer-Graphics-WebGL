# Interactive Graphics - 3D Cube

The goal of this homework is to use WebGL with control code written in JavaScript in order to draw an interactive 3D Cube in an HTML canvas in a web browser. The source code for this project can be accessed from my [GitHub page](https://github.com/ibiscp/Computer-Graphics-WebGL).

### Task

A series of improvements were done in the base code in order to achieve the following effects:

1 - Add a button that changes the direction of the current rotation.

2 - Move the transformations matrices from the shader to the Javascript application, so that the ModelView and Projection matrix are computed in the application and then transferred to the shader.

3 - Include a scaling (uniform, all parameters have the same value) and a translation Matrix and control them with sliders.

4 - Define an orthographic projection with the planes near and far controlled by sliders.

5 - Define a perspective projection, introduce a button that switches between orthographic and perspective projection. The slider for near and far should work for both projections.

6 - Introduce a light source, replace the colors by the properties of the material (your choice) and assign to each vertex a normal.

7 - Implement both the Gouraud and the Phong shading models, with a button switching between them.
\end{enumerate}