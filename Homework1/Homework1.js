"use strict";

var canvas;
var gl;

var numVertices  = 36;

var numChecks = 8;

var program;

var c;

var flag = true;

var direction = true;
var perspective = true;
var sliderTX;
var sliderTY;
var sliderTZ;
var n;
var f;

var pointsArray = [];
var colorsArray = [];

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

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [45.0, 45.0, 45.0];

var thetaLoc;

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
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

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    document.getElementById("ButtonP").onclick = function(){perspective = !perspective;};
    document.getElementById("ButtonC").onclick = function(){direction = !direction;};

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag){
      if(direction)
        theta[axis] += 2.0;
      else
        theta[axis] -= 2.0;
    }
    if(perspective)
      var depth = 1.2;
    else
      var depth = 0.0;

    // Translade slider
    sliderTX = parseFloat(document.getElementById("SliderTX").value);
    document.getElementById("ValueTX").innerHTML = sliderTX;
    sliderTY = parseFloat(document.getElementById("SliderTY").value);
    document.getElementById("ValueTY").innerHTML = sliderTY;
    sliderTZ = parseFloat(document.getElementById("SliderTZ").value);
    document.getElementById("ValueTZ").innerHTML = sliderTZ;
    n = parseFloat(document.getElementById("SliderPN").value);
    document.getElementById("ValuePN").innerHTML = n;
    f = parseFloat(document.getElementById("SliderPF").value);
    document.getElementById("ValuePF").innerHTML = f;

    var theta_x_radians = theta[0] * Math.PI / 180;
    var s_x = Math.sin( theta_x_radians );
    var c_x = Math.cos( theta_x_radians );
    var rx = [
        1.0,  0.0,  0.0, 0.0,
        0.0,  c_x,  s_x, 0.0,
        0.0, -s_x,  c_x, 0.0,
        0.0,  0.0,  0.0, 1.0];

    var theta_y_radians = theta[1] * Math.PI / 180;
    var s_y = Math.sin( theta_y_radians );
    var c_y = Math.cos( theta_y_radians );
    var ry = [
        c_y, 0.0, -s_y, 0.0,
        0.0, 1.0,  0.0, 0.0,
        s_y, 0.0,  c_y, 0.0,
        0.0, 0.0,  0.0, 1.0];

    var theta_z_radians = theta[2] * Math.PI / 180;
    var s_z = Math.sin( theta_z_radians );
    var c_z = Math.cos( theta_z_radians );
    var rz = [
         c_z, s_z, 0.0, 0.0,
        -s_z, c_z, 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         0.0, 0.0, 0.0, 1.0];

     var tr = [
          sliderTZ, 0.0, 0.0, 0.0,
          0.0, sliderTZ, 0.0, 0.0,
          0.0, 0.0, sliderTZ, 0.0,
          sliderTX, sliderTY, 0.0, 1.0];

    var r = 1.0;
    var l = -1.0;
    var t = 1.0;
    var b = -1.0;
    var proj = [
         2.0/(r-l), 0.0, 0.0, -(r+l)/(r-l),
         0.0, 2.0/(t-b), 0.0, -(t+b)/(t-b),
         0.0, 0.0, -2/(f-n), -(f+n)/(f-n),
         0.0, 0.0, 0.0, 1.0];

    var depth_mat = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, -depth,
        0.0, 0.0, 0.0, 1.0];

    // var matrix = tr * rz * ry * rx;// * proj;
    // var matrix_loc = gl.getUniformLocation(program, "matrix");
    // gl.uniformMatrix4fv(matrix_loc, false, matrix); // false means "not transpose"

    var rx_loc = gl.getUniformLocation(program, "rx");
    var ry_loc = gl.getUniformLocation(program, "ry");
    var rz_loc = gl.getUniformLocation(program, "rz");
    var tr_loc = gl.getUniformLocation(program, "tr");
    var proj_loc = gl.getUniformLocation(program, "proj");
    var depth_loc = gl.getUniformLocation(program, "depth");

    gl.uniformMatrix4fv(rx_loc, false, rx); // false means "not transpose"
    gl.uniformMatrix4fv(ry_loc, false, ry); // false means "not transpose"
    gl.uniformMatrix4fv(rz_loc, false, rz); // false means "not transpose"
    gl.uniformMatrix4fv(tr_loc, false, tr); // false means "not transpose"
    gl.uniformMatrix4fv(proj_loc, false, proj); // false means "not transpose"
    gl.uniformMatrix4fv(depth_loc, false, depth_mat);

    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
