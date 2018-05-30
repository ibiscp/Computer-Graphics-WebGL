"use strict";

var canvas;
var gl;

var numVertices = 36;

var texSize = 256;
var numChecks = 8;

var program;

var texture1, texture2;

var c;

// Flags
var start = false;

var image1 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ ) {
    for ( var j = 0; j <texSize; j++ ) {
        var patchx = Math.floor(i/(texSize/numChecks));
        var patchy = Math.floor(j/(texSize/numChecks));
        if(patchx%2 ^ patchy%2) c = 255;
        else c = 0;
        //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
        image1[4*i*texSize+4*j] = c;
        image1[4*i*texSize+4*j+1] = c;
        image1[4*i*texSize+4*j+2] = c;
        image1[4*i*texSize+4*j+3] = 255;
    }
}

var image2 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ ) {
  for ( var j = 0; j <texSize; j++ ) {
    c = 50+j/2;//127+127*Math.sin(0.1*i*j);
    image2[4*i*texSize+4*j] = c;
    image2[4*i*texSize+4*j+1] = c;
    image2[4*i*texSize+4*j+2] = c;
    image2[4*i*texSize+4*j+3] = 255;
  }
}

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0)
];

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

// Configure Texture
function configureTexture() {
  texture1 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture1 );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  texture2 = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture2 );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
  gl.generateMipmap( gl.TEXTURE_2D );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  // pointsArray.push(vertices[a]);
  // colorsArray.push(vertexColors[a]);
  //
  // pointsArray.push(vertices[c]);
  // colorsArray.push(vertexColors[a]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[3]);
}

// function quad(a, b, c, d) {
//   var indices = [a, b, c, a, c, d];
//
//   for (var i=0; i<indices.lenght; i++){
//     pointsArray.push(vertices[indices[i]]);
//     colorsArray.push(vertexColors[a]);
//     //texCoordsArray.push(texCoord[i%3]);
//   }
// }

// function quad(a, b, c, d) {
//      pointsArray.push(vertices[a]);
//      colorsArray.push(vertexColors[a]);
//      texCoordsArray.push(texCoord[0]);
//
//      pointsArray.push(vertices[b]);
//      colorsArray.push(vertexColors[a]);
//      texCoordsArray.push(texCoord[1]);
//
//      pointsArray.push(vertices[c]);
//      colorsArray.push(vertexColors[a]);
//      texCoordsArray.push(texCoord[2]);
//
//      pointsArray.push(vertices[a]);
//      colorsArray.push(vertexColors[a]);
//      texCoordsArray.push(texCoord[0]);
//
//      pointsArray.push(vertices[c]);
//      colorsArray.push(vertexColors[a]);
//      texCoordsArray.push(texCoord[2]);
//
//      pointsArray.push(vertices[d]);
//      colorsArray.push(vertexColors[a]);
//      texCoordsArray.push(texCoord[3]);
// }

function cube(){
  quad( 1, 0, 3, 2 );
  quad( 2, 3, 7, 6 );
  quad( 3, 0, 4, 7 );
  quad( 6, 5, 1, 2 );
  quad( 4, 5, 6, 7 );
  quad( 5, 4, 0, 1 );
}

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

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
var theta = [180, 0, 180, 7, 180, 7, 180, 7, 180, 7, 0, -12];
var position = 0;
var leftUpperArmIncr = 1
var leftLowerArmIncr = 2
var rightUpperArmIncr = -1
var rightLowerArmIncr = -2
var leftUpperLegIncr = -1
var leftLowerLegIncr = -2
var rightUpperLegIncr = 1
var rightLowerLegIncr = 2
var tailIncr = 1;
var positionIncr = 0.1;
var headIncr = -0.7;

// Sizes
var torsoHeight = 2.5;
var torsoWidth = 5.0;
var upperArmHeight = 2.0;
var lowerArmHeight = 1.0;
var upperArmWidth  = 0.7;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.7;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 1.0;
var upperLegHeight = 2.0;
var headHeight = 2.3;
var headWidth = 1.8;
var tailHeight = 2.0;
var tailWidth = 0.3;

var numNodes = 12;
var numAngles = 13;

var stack = [];
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

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
    m = translate(0.0, -upperArmHeight+0.1, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 0, 0, 1));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:
    m = translate(0.0, -upperArmHeight+0.1, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 0, 0, 1));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
    m = translate(0.0, -upperLegHeight+0.1, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 0, 0, 1));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:
    m = translate(0.0, -upperLegHeight+0.1, 0.0);
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
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * upperArmHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * lowerArmHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * upperArmHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * lowerArmHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * upperLegHeight, 0.0) );
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
  instanceMatrix = mult(modelViewMatrix, translate( 0.0, -0.5 * lowerLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * upperLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * lowerLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
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

  projectionMatrix = ortho(-30.0,30.0,-15.0,15.0,-10.0,10.0);
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
  gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

  cube();

  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  var tBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

  var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
  gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vTexCoord );

  document.getElementById("Run").onclick = function(){start = !start;};

  configureTexture();

  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, texture1 );
  gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

  gl.activeTexture( gl.TEXTURE1 );
  gl.bindTexture( gl.TEXTURE_2D, texture2 );
  gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);

  for(i=0; i<numNodes; i++) initNodes(i);

  render();
}

var render = function() {
  gl.clear( gl.COLOR_BUFFER_BIT);

  if (start || theta[leftUpperArmId] != 0 || theta[rightUpperArmId] != 0){
    if (Math.abs(position) > 20){
      theta[torsoId] += 180;
      positionIncr *= -1;
      theta[head2Id] = 0;
      headIncr *= -1;
    }
    position += positionIncr;
    if (Math.abs(theta[head2Id]) < 80)
      theta[head2Id] += headIncr;
    // Tail
    if (Math.abs(theta[tailId]) > 12)
      tailIncr *= -1
    theta[tailId] += tailIncr
    // Left upper arm
    if (Math.abs(theta[leftUpperArmId]-180) > 25)
    leftUpperArmIncr *= -1
    theta[leftUpperArmId] += leftUpperArmIncr
    // Right upper arm
    if (Math.abs(theta[rightUpperArmId]-180) > 25)
    rightUpperArmIncr *= -1
    theta[rightUpperArmId] += rightUpperArmIncr
    // Left upper arm
    if (Math.abs(theta[leftUpperLegId]-180) > 25)
    leftUpperLegIncr *= -1
    theta[leftUpperLegId] += leftUpperLegIncr
    // Right upper arm
    if (Math.abs(theta[rightUpperLegId]-180) > 25)
    rightUpperLegIncr *= -1
    theta[rightUpperLegId] += rightUpperLegIncr

    // Left lower arm
    if (Math.abs(theta[leftUpperArmId]-7-180) > 7)
    leftLowerArmIncr *= -1
    theta[leftLowerArmId] += leftLowerArmIncr
    // Right Lower arm
    if (Math.abs(theta[rightUpperArmId]-7-180) > 7)
    rightLowerArmIncr *= -1
    theta[rightLowerArmId] += rightLowerArmIncr
    // Left Lower arm
    if (Math.abs(theta[leftUpperLegId]-7-180) > 7)
    leftLowerLegIncr *= -1
    theta[leftLowerLegId] += leftLowerLegIncr
    // Right Lower arm
    if (Math.abs(theta[rightUpperLegId]-7-180) > 7)
    rightLowerLegIncr *= -1
    theta[rightLowerLegId] += rightLowerLegIncr
  }

  for(i=0; i<numNodes; i++) initNodes(i);
  traverse(torsoId);
  requestAnimFrame(render);
}
