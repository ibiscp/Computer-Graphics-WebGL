"use strict";

// Program
var canvas;
var gl;
var numVertices  = 36;
var program;

// Buttons
var flag = true;
var direction = true;
var perspec = false;
var shading = false;

// Sliders
var sliderTX;
var sliderTY;
var sliderTZ;
var sliderScale;

// Arrays
var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

// Matrices
var modelViewMatrix;
var projectionMatrix;

// Camera
var eye = vec3(0.0, 0.0, 1.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Orthogonal
var left = -1.0;
var right = 1.0;
var bottom = -1.0;
var ytop = 1.0;
var near;
var far;

// Perspective
var fovy = 100.0;
var aspect = 1.0;

// Axis
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

// Cube Angle
var theta = [45.0, 45.0, 45.0];

// Lights
var ambientColor, diffuseColor, specularColor;
var lightX;
var lightY;
var lightZ;

// Lights
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// Materials
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 1.0;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
     normalsArray.push(normal);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    colorCube();

    // Color
    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    // var vColor = gl.getAttribLocation( program, "vColor" );
    // gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vColor );

    // Shape
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Normal
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // Light
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );

    // Buttons
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    document.getElementById("ButtonP").onclick = function(){perspec = !perspec;};
    document.getElementById("ButtonC").onclick = function(){direction = !direction;};
    document.getElementById("ButtonS").onclick = function(){shading = !shading;};

    gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag){
      if(direction)
        theta[axis] += 2.0;
      else
        theta[axis] -= 2.0;}

    gl.uniform1f(gl.getUniformLocation(program,"shading"), shading);

    // Translade slider
    sliderTX = parseFloat(document.getElementById("SliderTX").value);
    document.getElementById("ValueTX").innerHTML = sliderTX;
    sliderTY = parseFloat(document.getElementById("SliderTY").value);
    document.getElementById("ValueTY").innerHTML = sliderTY;
    sliderTZ = parseFloat(document.getElementById("SliderTZ").value);
    document.getElementById("ValueTZ").innerHTML = sliderTZ;
    sliderScale = parseFloat(document.getElementById("SliderScale").value);
    document.getElementById("ValueScale").innerHTML = sliderScale;
    near = parseFloat(document.getElementById("SliderPN").value);
    document.getElementById("ValuePN").innerHTML = near;
    far = parseFloat(document.getElementById("SliderPF").value);
    document.getElementById("ValuePF").innerHTML = far;

    // Light
    lightX = parseFloat(document.getElementById("LightX").value);
    document.getElementById("ValueLX").innerHTML = lightX;
    lightY = parseFloat(document.getElementById("LightY").value);
    document.getElementById("ValueLY").innerHTML = lightY;
    lightZ = parseFloat(document.getElementById("LightZ").value);
    document.getElementById("ValueLZ").innerHTML = lightZ;
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(vec4(lightX, lightY, lightZ, 0.0 )) );

    // Model matrix
    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, scalem(sliderScale, sliderScale, sliderScale));
    modelViewMatrix = mult(modelViewMatrix, translate(sliderTX, sliderTY, sliderTZ));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));

    // Orthogonal or Perspective
    if(perspec)
      projectionMatrix = perspective(fovy, aspect, near, far);
    else
      projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimFrame(render);
}
