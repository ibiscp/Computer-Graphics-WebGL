"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

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

// IDs
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 11;

// Angles and position of the dog
var theta = [180, 0, 25, 15, -25, 15, -25, 15, 25, 15, 0, 12];
var position = 0;
var leftUpperArmIncr = 1
var rightUpperArmIncr = 1
var leftUpperLegIncr = 1
var rightUpperLegIncr = 1
var tailIncr = 1;

// Sizes
var torsoHeight = 2.5;
var torsoWidth = 6.0;
var upperArmHeight = 1.5;
var lowerArmHeight = 1.5;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 1.5;
var upperLegHeight = 1.5;
var headHeight = 2.3;
var headWidth = 1.8;
var tailHeight = 2.0;
var tailWidth = 0.3;

var numNodes = 12;
var numAngles = 13;
//var angle = 0;

//var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    //canvas = document.getElementById( "gl-canvas" );
    //gl.viewport( 0, 0, canvas.width, canvas.height );

    switch(Id) {

    case torsoId:
    m = translate(position, 0.0, 0.0);
    m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:
    m = translate(-0.5*torsoWidth-0.5*headWidth+0.3, 0.6*torsoHeight, 0.0);
  	m = mult(m, rotate(theta[head1Id], 1, 0, 0));
  	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, rotate(-45, 0, 0, 1));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, tailId, null);
    break;

    case tailId:
    m = translate(0.5*torsoWidth-0.1, torsoHeight - 0.5*tailWidth-0.1, 0.0);
    m = mult(m, rotate(-45, 0, 0, 1));
    m = mult(m, rotate(theta[tailId], 0, 0, 1));
    figure[tailId] = createNode( m, tail, leftUpperArmId, null );
    break;

    case leftUpperArmId:
    m = translate(-0.5*torsoWidth + 0.5*upperArmWidth, 0.1, 0.5*torsoHeight-0.5*upperLegWidth);
    m = mult(m, rotate(180, 0, 0, 1));
  	m = mult(m, rotate(theta[leftUpperArmId], 0, 0, 1));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
    m = translate(-0.5*torsoWidth + 0.5*upperArmWidth, 0.1, -0.5*torsoHeight+0.5*upperLegWidth);
    m = mult(m, rotate(180, 0, 0, 1));
  	m = mult(m, rotate(theta[rightUpperArmId], 0, 0, 1));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:
    m = translate(0.5*torsoWidth - 0.5*upperArmWidth, 0.1, 0.5*torsoHeight-0.5*upperLegWidth);
    m = mult(m, rotate(180, 0, 0, 1));
  	m = mult(m , rotate(theta[leftUpperLegId], 0, 0, 1));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
    m = translate(0.5*torsoWidth - 0.5*upperArmWidth, 0.1, -0.5*torsoHeight+0.5*upperLegWidth);
    m = mult(m, rotate(180, 0, 0, 1));
  	m = mult(m, rotate(theta[rightUpperLegId], 0, 0, 1));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:
    m = translate(0.0, upperArmHeight-0.1, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 0, 0, 1));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:
    m = translate(0.0, upperArmHeight-0.1, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 0, 0, 1));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
    m = translate(0.0, upperLegHeight-0.1, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 0, 0, 1));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:
    m = translate(0.0, upperLegHeight-0.1, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 0, 0, 1));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;
  }
}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoHeight));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}

function cube(){
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
    gl.clearColor( 0.862, 0.819, 0.819, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();
    //
    // hor = canvas.width
    // ver = canvas.height
    projectionMatrix = ortho(-30.0,30.0,-15.0,15.0,-10.0,10.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //     document.getElementById("slider0").onchange = function(event) {
    //     theta[torsoId ] = event.target.value;
    //     initNodes(torsoId);
    // };
    //     document.getElementById("slider1").onchange = function(event) {
    //     theta[head1Id] = event.target.value;
    //     initNodes(head1Id);
    // };
    // document.getElementById("slider2").onchange = function(event) {
    //      theta[leftUpperArmId] = event.target.value;
    //      initNodes(leftUpperArmId);
    // };
    // document.getElementById("slider3").onchange = function(event) {
    //      theta[leftLowerArmId] =  event.target.value;
    //      initNodes(leftLowerArmId);
    // };
    //     document.getElementById("slider4").onchange = function(event) {
    //     theta[rightUpperArmId] = event.target.value;
    //     initNodes(rightUpperArmId);
    // };
    // document.getElementById("slider5").onchange = function(event) {
    //      theta[rightLowerArmId] =  event.target.value;
    //      initNodes(rightLowerArmId);
    // };
    //     document.getElementById("slider6").onchange = function(event) {
    //     theta[leftUpperLegId] = event.target.value;
    //     initNodes(leftUpperLegId);
    // };
    // document.getElementById("slider7").onchange = function(event) {
    //      theta[leftLowerLegId] = event.target.value;
    //      initNodes(leftLowerLegId);
    // };
    // document.getElementById("slider8").onchange = function(event) {
    //      theta[rightUpperLegId] =  event.target.value;
    //      initNodes(rightUpperLegId);
    // };
    //     document.getElementById("slider9").onchange = function(event) {
    //     theta[rightLowerLegId] = event.target.value;
    //     initNodes(rightLowerLegId);
    // };
    // document.getElementById("slider10").onchange = function(event) {
    //      theta[head2Id] = event.target.value;
    //      initNodes(head2Id);
    // };
    // document.getElementById("slider11").onchange = function(event) {
    //      theta[tailId] = event.target.value;
    //      initNodes(tailId);
    // };

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}

var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        //theta[torsoId] += 0.5;
        // position += 0.1;
        // if (position > 18)
        //   position = -18;

        // Tail
        if (Math.abs(theta[tailId]) > 12){
          tailIncr *= -1

        }
        theta[tailId] += tailIncr
        // Left upper arm
        if (Math.abs(theta[leftUpperArmId]) > 25)
          leftUpperArmIncr *= -1
        theta[leftUpperArmId] += leftUpperArmIncr
        // Right upper arm
        if (Math.abs(theta[rightUpperArmId]) > 25)
          rightUpperArmIncr *= -1
        theta[rightUpperArmId] += rightUpperArmIncr
        // Left upper arm
        if (Math.abs(theta[leftUpperLegId]) > 25)
          leftUpperLegIncr *= -1
        theta[leftUpperLegId] += leftUpperLegIncr
        // Right upper arm
        if (Math.abs(theta[rightUpperLegId]) > 25)
          rightUpperLegIncr *= -1
        theta[rightUpperLegId] += rightUpperLegIncr

        for(i=0; i<numNodes; i++) initNodes(i);
        traverse(torsoId);
        requestAnimFrame(render);
}