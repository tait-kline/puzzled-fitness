// Always execute in strict mode (less bug)
'use strict';

/* to1DF32Array(a2DArray)
 *
 * This function turns an array of 4-element arrays a2DArray into a packed
 * 1-dimensional array of 32-bit floating-point numbers.
 *
 * NOTE: This function should not be here. It should be in your library.
 */
function to1DF32Array(a2DArray)
{
    var size = a2DArray.length;

    if(size == 0)
    {
        console.log("[alib/to1DF32Array - DEBUG]: size is 0");
        return new Float32Array([]);
    }

    // Turn 2D array into 1D array
    
    var result = [];
    var index = 0;

    for(var i = 0; i < size; i++)
    {
        var anElement = a2DArray[i];
        
        if(anElement.length != 4)
            console.log("[laib/to1DF32Array - ERROR]: Not a 4-element vector");
        
        result[index] = anElement[0];
        result[index + 1] = anElement[1];
        result[index + 2] = anElement[2];
        result[index + 3] = anElement[3];
        index += 4;
    }

    return new Float32Array(result);
}
function initGL(canvas)
{
    gl = canvas.getContext("webgl");
    if(!gl)
    {
	alert("WebGL is not available...");
	return -1;
    }

    // Set the clear screen color to black (R, G, B, A)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Enable hidden surface removal
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return 0;
}

function init()
{
    var positions = shape;

    var colors = randomColors();

    var o = 2;

    model_view = look_at([0, 0, 1, 0], [0, 0, 0, 0], [0, 1, 0, 0]);
    projection = ortho(-o, o, -o, o, o, -o);

    // Load and compile shader programs
    var shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    if(shaderProgram == -1)
	return -1;
    gl.useProgram(shaderProgram)

    // Allocate memory in a graphics card
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (positions.length + colors.length), gl.STATIC_DRAW);
    // Transfer positions and put it at the beginning of the buffer
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions));
    // Transfer colors and put it right after positions
    gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions.length, to1DF32Array(colors));

    // Vertex Position - locate and enable "vPosition"
    var vPosition_location = gl.getAttribLocation(shaderProgram, "vPosition");
    if (vPosition_location == -1)
    { 
        alert("Unable to locate vPosition");
        return -1;
    }
    gl.enableVertexAttribArray(vPosition_location);
    // vPosition starts at offset 0
    gl.vertexAttribPointer(vPosition_location, 4, gl.FLOAT, false, 0, 0);

    // Vertex Color - locate and enable vColor
    var vColor_location = gl.getAttribLocation(shaderProgram, "vColor");
    if (vColor_location == -1)
    { 
        alert("Unable to locate vColor");
        return -1;
    }
    gl.enableVertexAttribArray(vColor_location);
    // vColor starts at the end of positions
    gl.vertexAttribPointer(vColor_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions.length);

    // Current Transformation Matrix - locate and enable "ctm"
    ctm_location = gl.getUniformLocation(shaderProgram, "ctm");
    if (ctm_location == -1)
    { 
        alert("Unable to locate ctm");
        return -1;
    }

    model_view_location = gl.getUniformLocation(shaderProgram, "model_view");
    if (model_view_location == null)
    {
        alert("Unable to locate model_view");
        return -1;
    }

    projection_location = gl.getUniformLocation(shaderProgram, "projection");
    if (projection_location == null)
    {
        alert("Unable to locate projection");
        return -1;
    }

    return 0;
}

function cubePositions(){
    var positions = [];
    var count = 0;
    for(let i = 0; i < 360; i += 90){
        var val = (i / 180) * Math.PI;
        var next = i + 90;
        var nxt = (next / 180) * Math.PI; 
        positions[count] = [0.3*Math.cos(nxt), -0.3, 0.3*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.0, -0.3, 0.0, 1.0];
        positions[count + 2] = [0.3*Math.cos(val), -0.3, 0.3*Math.sin(val), 1.0];
        
        count += 3;
    }

    for(let i = 0; i < 360; i += 90){
        var val = (i / 180) * Math.PI;
        var next = i + 90;
        var nxt = (next / 180) * Math.PI;

        positions[count] = [0.3*Math.cos(nxt), 0.1, 0.3*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.3*Math.cos(val), -0.3, 0.3*Math.sin(val), 1.0];
        positions[count + 2] = [0.3*Math.cos(val), 0.1, 0.3*Math.sin(val), 1.0];

        positions[count + 3] = [0.3*Math.cos(nxt), 0.1, 0.3*Math.sin(nxt), 1.0];
        positions[count + 4] = [0.3*Math.cos(nxt), -0.3, 0.3*Math.sin(nxt), 1.0];
        positions[count + 5] = [0.3*Math.cos(val), -0.3, 0.3*Math.sin(val), 1.0];

        count += 6;
    }

    for(let i = 0; i < 360; i += 90){
        var val = (i / 180) * Math.PI;
        var next = i + 90;
        var nxt = (next / 180) * Math.PI;
        positions[count] = [0.3*Math.cos(val), 0.1, 0.3*Math.sin(val), 1.0];
        positions[count + 1] = [0.0, 0.1, 0.0, 1.0];
        positions[count + 2] = [0.3*Math.cos(nxt), 0.1, 0.3*Math.sin(nxt), 1.0];
        count += 3;
    }
    return positions;
}

function rectanglePositions(l, h, w){
    var positions = [];
    var count = 0;
    for(let i = 0; i < 360; i += 90){
        var val = (i / 180) * Math.PI;
        var next = i + 90;
        var nxt = (next / 180) * Math.PI; 
        positions[count] = [l*Math.cos(nxt), -h, w*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.0, -h, 0.0, 1.0];
        positions[count + 2] = [l*Math.cos(val), -h, w*Math.sin(val), 1.0];
        
        count += 3;
    }

    for(let i = 0; i < 360; i += 90){
        var val = (i / 180) * Math.PI;
        var next = i + 90;
        var nxt = (next / 180) * Math.PI;

        positions[count] = [l*Math.cos(nxt), h, w*Math.sin(nxt), 1.0];
        positions[count + 1] = [l*Math.cos(val), -h, w*Math.sin(val), 1.0];
        positions[count + 2] = [l*Math.cos(val), h, w*Math.sin(val), 1.0];

        positions[count + 3] = [l*Math.cos(nxt), h, w*Math.sin(nxt), 1.0];
        positions[count + 4] = [l*Math.cos(nxt), -h, w*Math.sin(nxt), 1.0];
        positions[count + 5] = [l*Math.cos(val), -h, w*Math.sin(val), 1.0];

        count += 6;
    }

    for(let i = 0; i < 360; i += 90){
        var val = (i / 180) * Math.PI;
        var next = i + 90;
        var nxt = (next / 180) * Math.PI;
        positions[count] = [l*Math.cos(val), h, w*Math.sin(val), 1.0];
        positions[count + 1] = [0.0, h, 0.0, 1.0];
        positions[count + 2] = [l*Math.cos(nxt), h, w*Math.sin(nxt), 1.0];
        count += 3;
    }
    return positions;
}

function conePositions(){
    var positions = [];
    var count = 0;
    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI;
        positions[count] = [0.7*Math.cos(nxt), -0.5, 0.7*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.0, -0.5, 0.0, 1.0];
        positions[count + 2] = [0.7*Math.cos(val), -0.5, 0.7*Math.sin(val), 1.0];
        count += 3;
    }
    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI;
        positions[count] = [0.0, 0.9, 0.0, 1.0];
        positions[count + 1] = [0.7*Math.cos(nxt), -0.5, 0.7*Math.sin(nxt), 1.0];
        positions[count + 2] = [0.7*Math.cos(val), -0.5, 0.7*Math.sin(val), 1.0];
        count += 3;
    }
    return positions;
}

function cylinderPositions(){
    var positions = [];
    var count = 0;
    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI; 
        positions[count] = [0.7*Math.cos(nxt), -0.7, 0.7*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.0, -0.7, 0.0, 1.0];
        positions[count + 2] = [0.7*Math.cos(val), -0.7, 0.7*Math.sin(val), 1.0];
        
        count += 3;
    }

    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI;

        positions[count] = [0.7*Math.cos(nxt), 0.7, 0.7*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.7*Math.cos(val), -0.7, 0.7*Math.sin(val), 1.0];
        positions[count + 2] = [0.7*Math.cos(val), 0.7, 0.7*Math.sin(val), 1.0];

        positions[count + 3] = [0.7*Math.cos(nxt), 0.7, 0.7*Math.sin(nxt), 1.0];
        positions[count + 4] = [0.7*Math.cos(nxt), -0.7, 0.7*Math.sin(nxt), 1.0];
        positions[count + 5] = [0.7*Math.cos(val), -0.7, 0.7*Math.sin(val), 1.0];

        count += 6;
    }

    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI;
        positions[count] = [0.7*Math.cos(val), 0.7, 0.7*Math.sin(val), 1.0];
        positions[count + 1] = [0.0, 0.7, 0.0, 1.0];
        positions[count + 2] = [0.7*Math.cos(nxt), 0.7, 0.7*Math.sin(nxt), 1.0];
        count += 3;
    }
    return positions;
}

function szCylinderPositions(h, w){
    var positions = [];
    var count = 0;
    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI; 
        positions[count] = [w*Math.cos(nxt), -h, w*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.0, -h, 0.0, 1.0];
        positions[count + 2] = [w*Math.cos(val), -h, w*Math.sin(val), 1.0];
        
        count += 3;
    }

    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI;

        positions[count] = [w*Math.cos(nxt), h, w*Math.sin(nxt), 1.0];
        positions[count + 1] = [w*Math.cos(val), -h, w*Math.sin(val), 1.0];
        positions[count + 2] = [w*Math.cos(val), h, w*Math.sin(val), 1.0];

        positions[count + 3] = [w*Math.cos(nxt), h, w*Math.sin(nxt), 1.0];
        positions[count + 4] = [w*Math.cos(nxt), -h, w*Math.sin(nxt), 1.0];
        positions[count + 5] = [w*Math.cos(val), -h, w*Math.sin(val), 1.0];

        count += 6;
    }

    for(let i = 0; i < 360; i += 10){
        var val = (i / 180) * Math.PI;
        var next = i + 10;
        var nxt = (next / 180) * Math.PI;
        positions[count] = [w*Math.cos(val), h, w*Math.sin(val), 1.0];
        positions[count + 1] = [0.0, h, 0.0, 1.0];
        positions[count + 2] = [w*Math.cos(nxt), h, w*Math.sin(nxt), 1.0];
        count += 3;
    }
    return positions;
}

function spherePositions(){
    var positions = [];
    positions[0] = [-0.16, 0.16, 0.9, 1.0];
    positions[1] = [-0.16, -0.16, 0.9, 1.0];
    positions[2] = [0.16, -0.16, 0.9, 1.0];
    positions[3] = [0.16, 0.16, 0.9, 1.0];
    positions[4] = [-0.16, 0.16, 0.9, 1.0];
    positions[5] = [0.16, -0.16, 0.9, 1.0];
    var vec = new Vector(positions[0][0], positions[0][1], positions[0][2], positions[0][3]);
    var vec1 = new Vector(positions[1][0], positions[1][1], positions[1][2], positions[1][3]);
    var vec2 = new Vector(positions[2][0], positions[2][1], positions[2][2], positions[2][3]);
    var vec3 = new Vector(positions[3][0], positions[3][1], positions[3][2], positions[3][3]);
    var vec4 = new Vector(positions[4][0], positions[4][1], positions[4][2], positions[4][3]);
    var vec5 = new Vector(positions[5][0], positions[5][1], positions[5][2], positions[5][3]);
    var count = 6;
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var maty = rotateY(val);
        positions[count] = matVecMult(maty, vec).arr;
        positions[count + 1] = matVecMult(maty, vec1).arr;
        positions[count + 2] = matVecMult(maty, vec2).arr;
        positions[count + 3] = matVecMult(maty, vec3).arr;
        positions[count + 4] = matVecMult(maty, vec4).arr;
        positions[count + 5] = matVecMult(maty, vec5).arr;
        count += 6;
    }

    var maty = rotateX((20 / 180) * Math.PI);
    positions[count] = matVecMult(maty, vec).arr;
    positions[count + 1] = matVecMult(maty, vec1).arr;
    positions[count + 1][0] += 0.02;
    positions[count + 2] = matVecMult(maty, vec2).arr;
    positions[count + 2][0] -= 0.02;
    positions[count + 3] = matVecMult(maty, vec3).arr;
    positions[count + 4] = matVecMult(maty, vec4).arr;
    positions[count + 5] = matVecMult(maty, vec5).arr;
    positions[count + 5][0] -= 0.02;
    vec = new Vector(positions[count][0], positions[count][1], positions[count][2], positions[count][3]);
    vec1 = new Vector(positions[count+1][0], positions[count+1][1], positions[count+1][2], positions[count+1][3]);
    vec2 = new Vector(positions[count+2][0], positions[count+2][1], positions[count+2][2], positions[count+2][3]);
    vec3 = new Vector(positions[count+3][0], positions[count+3][1], positions[count+3][2], positions[count+3][3]);
    vec4 = new Vector(positions[count+4][0], positions[count+4][1], positions[count+4][2], positions[count+4][3]);
    vec5 = new Vector(positions[count+5][0], positions[count+5][1], positions[count+5][2], positions[count+5][3]);
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var maty = rotateY(val);
        positions[count] = matVecMult(maty, vec).arr;
        positions[count + 1] = matVecMult(maty, vec1).arr;
        positions[count + 2] = matVecMult(maty, vec2).arr;
        positions[count + 3] = matVecMult(maty, vec3).arr;
        positions[count + 4] = matVecMult(maty, vec4).arr;
        positions[count + 5] = matVecMult(maty, vec5).arr;
        count += 6;
    }
     
    var maty = rotateX((20 / 180) * Math.PI);
    positions[count] = matVecMult(maty, vec).arr;
    positions[count][0] += 0.02;
    positions[count + 1] = matVecMult(maty, vec1).arr;
    positions[count + 1][0] += 0.035;
    positions[count + 2] = matVecMult(maty, vec2).arr;
    positions[count + 2][0] -= 0.035;
    positions[count + 3] = matVecMult(maty, vec3).arr;
    positions[count + 3][0] -= 0.02;
    positions[count + 4] = matVecMult(maty, vec4).arr;
    positions[count + 4][0] += 0.02;
    positions[count + 5] = matVecMult(maty, vec5).arr;
    positions[count + 5][0] -= 0.035;
    vec = new Vector(positions[count][0], positions[count][1], positions[count][2], positions[count][3]);
    vec1 = new Vector(positions[count+1][0], positions[count+1][1], positions[count+1][2], positions[count+1][3]);
    vec2 = new Vector(positions[count+2][0], positions[count+2][1], positions[count+2][2], positions[count+2][3]);
    vec3 = new Vector(positions[count+3][0], positions[count+3][1], positions[count+3][2], positions[count+3][3]);
    vec4 = new Vector(positions[count+4][0], positions[count+4][1], positions[count+4][2], positions[count+4][3]);
    vec5 = new Vector(positions[count+5][0], positions[count+5][1], positions[count+5][2], positions[count+5][3]);
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var mat = rotateY(val);
        positions[count] = matVecMult(mat, vec).arr;
        positions[count + 1] = matVecMult(mat, vec1).arr;
        positions[count + 2] = matVecMult(mat, vec2).arr;
        positions[count + 3] = matVecMult(mat, vec3).arr;
        positions[count + 4] = matVecMult(mat, vec4).arr;
        positions[count + 5] = matVecMult(mat, vec5).arr;
        count += 6;
    }

    positions[count] = matVecMult(maty, vec).arr;
    positions[count][0] += 0.035;
    positions[count + 1] = matVecMult(maty, vec1).arr;
    positions[count + 1][0] += 0.05;
    positions[count + 2] = matVecMult(maty, vec2).arr;
    positions[count + 2][0] -= 0.05;
    positions[count + 3] = matVecMult(maty, vec3).arr;
    positions[count + 3][0] -= 0.035;
    positions[count + 4] = matVecMult(maty, vec4).arr;
    positions[count + 4][0] += 0.035;
    positions[count + 5] = matVecMult(maty, vec5).arr;
    positions[count + 5][0] -= 0.05;
    vec = new Vector(positions[count][0], positions[count][1], positions[count][2], positions[count][3]);
    vec1 = new Vector(positions[count+1][0], positions[count+1][1], positions[count+1][2], positions[count+1][3]);
    vec2 = new Vector(positions[count+2][0], positions[count+2][1], positions[count+2][2], positions[count+2][3]);
    vec3 = new Vector(positions[count+3][0], positions[count+3][1], positions[count+3][2], positions[count+3][3]);
    vec4 = new Vector(positions[count+4][0], positions[count+4][1], positions[count+4][2], positions[count+4][3]);
    vec5 = new Vector(positions[count+5][0], positions[count+5][1], positions[count+5][2], positions[count+5][3]);
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var mat = rotateY(val);
        positions[count] = matVecMult(mat, vec).arr;
        positions[count + 1] = matVecMult(mat, vec1).arr;
        positions[count + 2] = matVecMult(mat, vec2).arr;
        positions[count + 3] = matVecMult(mat, vec3).arr;
        positions[count + 4] = matVecMult(mat, vec4).arr;
        positions[count + 5] = matVecMult(mat, vec5).arr;
        count += 6;
    }

    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var next = i + 20;
        var nxt = (next / 180) * Math.PI; 
        positions[count] = [0.32*Math.cos(nxt), -0.855, 0.32*Math.sin(nxt), 1.0];
        positions[count + 1] = [0.0, -0.95, 0.0, 1.0];
        positions[count + 2] = [0.32*Math.cos(val), -0.855, 0.32*Math.sin(val), 1.0];
        
        count += 3;
    }

    createTopHalf(positions, count);
    return positions;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createTopHalf(positions, count){
    var vec = new Vector(positions[0][0], positions[0][1], positions[0][2], positions[0][3]);
    var vec1 = new Vector(positions[1][0], positions[1][1], positions[1][2], positions[1][3]);
    var vec2 = new Vector(positions[2][0], positions[2][1], positions[2][2], positions[2][3]);
    var vec3 = new Vector(positions[3][0], positions[3][1], positions[3][2], positions[3][3]);
    var vec4 = new Vector(positions[4][0], positions[4][1], positions[4][2], positions[4][3]);
    var vec5 = new Vector(positions[5][0], positions[5][1], positions[5][2], positions[5][3]);
    var maty = rotateX((-20 / 180) * Math.PI);
    positions[count] = matVecMult(maty, vec).arr;
    positions[count][0] += 0.02;
    positions[count + 1] = matVecMult(maty, vec1).arr;
    positions[count + 2] = matVecMult(maty, vec2).arr;
    positions[count + 3] = matVecMult(maty, vec3).arr;
    positions[count + 3][0] -= 0.02;
    positions[count + 4] = matVecMult(maty, vec4).arr;
    positions[count + 4][0] += 0.02;
    positions[count + 5] = matVecMult(maty, vec5).arr;
    vec = new Vector(positions[count][0], positions[count][1], positions[count][2], positions[count][3]);
    vec1 = new Vector(positions[count+1][0], positions[count+1][1], positions[count+1][2], positions[count+1][3]);
    vec2 = new Vector(positions[count+2][0], positions[count+2][1], positions[count+2][2], positions[count+2][3]);
    vec3 = new Vector(positions[count+3][0], positions[count+3][1], positions[count+3][2], positions[count+3][3]);
    vec4 = new Vector(positions[count+4][0], positions[count+4][1], positions[count+4][2], positions[count+4][3]);
    vec5 = new Vector(positions[count+5][0], positions[count+5][1], positions[count+5][2], positions[count+5][3]);
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var maty = rotateY(val);
        positions[count] = matVecMult(maty, vec).arr;
        positions[count + 1] = matVecMult(maty, vec1).arr;
        positions[count + 2] = matVecMult(maty, vec2).arr;
        positions[count + 3] = matVecMult(maty, vec3).arr;
        positions[count + 4] = matVecMult(maty, vec4).arr;
        positions[count + 5] = matVecMult(maty, vec5).arr;
        count += 6;
    }
    maty = rotateX((-20 / 180) * Math.PI);
    positions[count] = matVecMult(maty, vec).arr;
    positions[count][0] += 0.035;
    positions[count + 1] = matVecMult(maty, vec1).arr;
    positions[count + 1][0] += 0.02;
    positions[count + 2] = matVecMult(maty, vec2).arr;
    positions[count + 2][0] -= 0.02;
    positions[count + 3] = matVecMult(maty, vec3).arr;
    positions[count + 3][0] -= 0.035;
    positions[count + 4] = matVecMult(maty, vec4).arr;
    positions[count + 4][0] += 0.035;
    positions[count + 5] = matVecMult(maty, vec5).arr;
    positions[count + 5][0] -= 0.02;
    vec = new Vector(positions[count][0], positions[count][1], positions[count][2], positions[count][3]);
    vec1 = new Vector(positions[count+1][0], positions[count+1][1], positions[count+1][2], positions[count+1][3]);
    vec2 = new Vector(positions[count+2][0], positions[count+2][1], positions[count+2][2], positions[count+2][3]);
    vec3 = new Vector(positions[count+3][0], positions[count+3][1], positions[count+3][2], positions[count+3][3]);
    vec4 = new Vector(positions[count+4][0], positions[count+4][1], positions[count+4][2], positions[count+4][3]);
    vec5 = new Vector(positions[count+5][0], positions[count+5][1], positions[count+5][2], positions[count+5][3]);
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var mat = rotateY(val);
        positions[count] = matVecMult(mat, vec).arr;
        positions[count + 1] = matVecMult(mat, vec1).arr;
        positions[count + 2] = matVecMult(mat, vec2).arr;
        positions[count + 3] = matVecMult(mat, vec3).arr;
        positions[count + 4] = matVecMult(mat, vec4).arr;
        positions[count + 5] = matVecMult(mat, vec5).arr;
        count += 6;
    }

    positions[count] = matVecMult(maty, vec).arr;
    positions[count][0] += 0.05;
    positions[count + 1] = matVecMult(maty, vec1).arr;
    positions[count + 1][0] += 0.035;
    positions[count + 2] = matVecMult(maty, vec2).arr;
    positions[count + 2][0] -= 0.035;
    positions[count + 3] = matVecMult(maty, vec3).arr;
    positions[count + 3][0] -= 0.05;
    positions[count + 4] = matVecMult(maty, vec4).arr;
    positions[count + 4][0] += 0.05;
    positions[count + 5] = matVecMult(maty, vec5).arr;
    positions[count + 5][0] -= 0.035;
    vec = new Vector(positions[count][0], positions[count][1], positions[count][2], positions[count][3]);
    vec1 = new Vector(positions[count+1][0], positions[count+1][1], positions[count+1][2], positions[count+1][3]);
    vec2 = new Vector(positions[count+2][0], positions[count+2][1], positions[count+2][2], positions[count+2][3]);
    vec3 = new Vector(positions[count+3][0], positions[count+3][1], positions[count+3][2], positions[count+3][3]);
    vec4 = new Vector(positions[count+4][0], positions[count+4][1], positions[count+4][2], positions[count+4][3]);
    vec5 = new Vector(positions[count+5][0], positions[count+5][1], positions[count+5][2], positions[count+5][3]);
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var mat = rotateY(val);
        positions[count] = matVecMult(mat, vec).arr;
        positions[count + 1] = matVecMult(mat, vec1).arr;
        positions[count + 2] = matVecMult(mat, vec2).arr;
        positions[count + 3] = matVecMult(mat, vec3).arr;
        positions[count + 4] = matVecMult(mat, vec4).arr;
        positions[count + 5] = matVecMult(mat, vec5).arr;
        count += 6;
    }
    for(let i = 0; i < 360; i += 20){
        var val = (i / 180) * Math.PI;
        var next = i + 20;
        var nxt = (next / 180) * Math.PI; 
        positions[count] = [0.32*Math.cos(val), 0.855, 0.32*Math.sin(val), 1.0];
        positions[count + 1] = [0.0, 0.95, 0.0, 1.0];
        positions[count + 2] = [0.32*Math.cos(nxt), 0.855, 0.32*Math.sin(nxt), 1.0];
        
        count += 3;
    }
}

function randomColors(){  
    var colors = [];
    var green = [0, 1, 0, 1.0];
    var blue = [0, 0, 1, 1.0];
    var curr = green;
    for(let i = 0; i < shape.length; i++){
        colors[i] = green;
    }
    return colors;
}

function rotateX(d){
    var matrix = [];
    matrix[0] = [1, 0, 0, 0];
    matrix[1] = [0, Math.cos(d), Math.sin(d), 0];
    matrix[2] = [0, -Math.sin(d),  Math.cos(d), 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function rotateY(d){
    var matrix = [];
    matrix[0] = [Math.cos(d), 0, -Math.sin(d), 0];
    matrix[1] = [0, 1, 0, 0];
    matrix[2] = [Math.sin(d), 0, Math.cos(d), 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function rotateZ(d){
    var matrix = [];
    matrix[0] = [Math.cos(d), Math.sin(d), 0, 0];
    matrix[1] = [-Math.sin(d), Math.cos(d), 0, 0];
    matrix[2] = [0, 0, 1, 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function rotateXY(d){
    var x = rotateX(d);
    var y = rotateY(d);
    var matx = new Matrix(new Vector(x[0][0], x[0][1], x[0][2], x[0][3]), new Vector(x[1][0], x[1][1], x[1][2], x[1][3]), new Vector(x[2][0], x[2][1], x[2][2], x[2][3]), new Vector(x[3][0], x[3][1], x[3][2], x[3][3]));
    var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]), new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
    var mult = matMult(matx, maty).arr;
    var product = [];
    for(let i = 0; i < mult.length; i++){
        product[i] = mult[i].arr;
    }
    console.log(product);
    return product;
}

function translate(x, y, z){
    var matrix = [];
    matrix[0] = [1, 0, 0, 0];
    matrix[1] = [0, 1, 0, 0];
    matrix[2] = [0, 0, 1, 0];
    matrix[3] = [x, y, z, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function scale(x, y, z){
    var matrix = [];
    matrix[0] = [x, 0, 0, 0];
    matrix[1] = [0, y, 0, 0];
    matrix[2] = [0, 0, z, 0];
    matrix[3] = [0, 0, 0, 1];

    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function zoomIn(){
    var x = to2DArray(scale(1.2, 1.2, 1.2)).arr;
    var mat = new Matrix(new Vector(x[0][0], x[0][1], x[0][2], x[0][3]), new Vector(x[1][0], x[1][1], x[1][2], x[1][3]), new Vector(x[2][0], x[2][1], x[2][2], x[2][3]), new Vector(x[3][0], x[3][1], x[3][2], x[3][3]));
    for(let i = 0; i < shape.length; i++){
        var v = new Vector(shape[i][0], shape[i][1], shape[i][2], shape[i][3]);
        shape[i] = matVecMult(mat, v).arr;
    }    
}
function zoomOut(){
    var x = to2DArray(scale(0.8, 0.8, 0.8)).arr;
    var mat = new Matrix(new Vector(x[0][0], x[0][1], x[0][2], x[0][3]), new Vector(x[1][0], x[1][1], x[1][2], x[1][3]), new Vector(x[2][0], x[2][1], x[2][2], x[2][3]), new Vector(x[3][0], x[3][1], x[3][2], x[3][3]));
    for(let i = 0; i < shape.length; i++){
        var v = new Vector(shape[i][0], shape[i][1], shape[i][2], shape[i][3]);
        shape[i] = matVecMult(mat, v).arr;
    }    
}

function to2DArray(transformationMat){
    for(let i = 0; i < transformationMat.arr.length; i++){
        transformationMat.arr[i] = transformationMat.arr[i].arr;
    }
    return transformationMat
}

function ortho(left, right, bottom, top, near, far){
    var m = [];
    m[0] = [(2/(right - left)), 0, 0, 0];
    m[1] = [0, (2/(top - bottom)), 0, 0];
    m[2] = [0, 0, (2/(near - far)), 0];
    m[3] = [-((right + left)/(right - left)), -((top + bottom)/(top - bottom)), -((near + far)/(near - far)), 1];
    return m;
}

function look_at(eye, at, up){
    var eyevec = new Vector(eye[0], eye[1], eye[2], eye[3]);
    var atvec = new Vector(at[0], at[1], at[2], at[3]);
    var upvec = new Vector(up[0], up[1], up[2], up[3]);

    var vpn = subVec(eyevec, atvec);
    var n = normalize(vpn);

    var almostU = crossProd(upvec, n);
    var u = normalize(almostU);

    var nxu = crossProd(n, u);
    var v = normalize(nxu);

    var R = new Matrix(new Vector(u.arr[0], v.arr[0], n.arr[0], 0), new Vector(u.arr[1], v.arr[1], n.arr[1], 0), 
    new Vector(u.arr[2], v.arr[2], n.arr[2], 0), new Vector(u.arr[3], v.arr[3], n.arr[3], 1));

    var T = new Matrix(new Vector(1, 0, 0, 0), new Vector(0, 1, 0, 0), new Vector(0, 0, 1, 0),
    new Vector(eyevec.arr[0], -(eyevec.arr[1]), -(eyevec.arr[2]), 1));

    var RT = matMult(R, T);

    var array = [];
    for(var i = 0; i < RT.arr.length; i++){
       array[i] = RT.arr[i].arr;
    }

    return array;
}

function drawPlane(size){
    var positions = [];
    var x = 0;
    var y = 0;
    var count = 0;
    for(var i = 0; i < size; i++){
        x = 0;
        for(var j = 0; j < size; j++){
            positions[count] = [(-0.5 + x), -0.1, (0.5 + y), 1];
            positions[count + 2] = [(-0.5 + x), -0.1, (0 + y), 1];
            positions[count + 1] = [(0 + x), -0.1, (0.5 + y), 1];

            positions[count + 3] = [(0 + x), -0.1, (0.5 + y), 1];
            positions[count + 5] = [(-0.5 + x), -0.1, (0 + y), 1];
            positions[count + 4] = [(0 + x), -0.1, (0 + y), 1]; 
            
            count += 6;
            x += 0.5;
        }
        y -= 0.5;
    }

    for(var i = 0; i < positions.length; i++){
        var tran = translate(-1.75, 0, 1.7);
        var curr = positions[i];
        var v = new Vector(curr[0], curr[1], curr[2], curr[3]);
        positions[i] = matVecMult(tran, v).arr;
    }
    return positions;
}

function toMat(y){
    var mat = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]), new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
    return mat;
}

function rotateArbitraryVec(vec, deg){
    var p0 = vec;
    var p1 = new Vector(0, 0, 0, 1);
    var v = normalize(subVec(p0, p1));
    var toOrigin = translate(-p0.arr[0], -p0.arr[1], -p0.arr[2]);
    var Rx = rotatePaneY(v.arr[1], v.arr[2]);
    var prod = matMult(Rx, toOrigin);
    var Ry = rotatePaneX(v.arr[0], v.arr[1], v.arr[2]);
    var prod1 = matMult(prod, Ry);
    var rotz = rotateZ(deg);
    var prod2 = matMult(prod1, rotz);
    var roty = rotatePaneXneg(v.arr[0], v.arr[1], v.arr[2]);
    var rotx = rotatePaneYneg(v.arr[1], v.arr[2]);
    var prod3 = matMult(prod2, roty);
    var prod4 = matMult(prod3, rotx);
    var t = translate(p0.arr[0], p0.arr[1], p0.arr[2]);
    var prod5 = matMult(prod4, t);
    return prod5;
}

function rotatePaneX(x, y, z){
    var matrix = [];
    var d = Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2));
    matrix[0] = [d, 0, -x, 0];
    matrix[1] = [0, 1, 0, 0];
    matrix[2] = [x, 0, d, 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function rotatePaneY(y, z){
    var matrix = [];
    var d = Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2));
    matrix[0] = [1, 0, 0, 0];
    matrix[1] = [0, (z/d), (y/d), 0];
    matrix[2] = [0, -(y/d),  (z/d), 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function rotatePaneXneg(x, y, z){
    var matrix = [];
    var d = Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2));
    matrix[0] = [-d, 0, x, 0];
    matrix[1] = [0, 1, 0, 0];
    matrix[2] = [-x, 0, -d, 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}

function rotatePaneYneg(y, z){
    var matrix = [];
    var d = Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2));
    matrix[0] = [1, 0, 0, 0];
    matrix[1] = [0, -(z/d), -(y/d), 0];
    matrix[2] = [0, (y/d),  -(z/d), 0];
    matrix[3] = [0, 0, 0, 1];
    var mat = function (){
        var y = matrix;
        var maty = new Matrix(new Vector(y[0][0], y[0][1], y[0][2], y[0][3]),
        new Vector(y[1][0], y[1][1], y[1][2], y[1][3]), new Vector(y[2][0], y[2][1], y[2][2], y[2][3]), new Vector(y[3][0], y[3][1], y[3][2], y[3][3]));
        return maty;
    }
    return mat();
}
