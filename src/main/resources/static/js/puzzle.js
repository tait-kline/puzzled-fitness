'use strict';
var gl = null;
var canvas = null;
var ctm_location;
var model_view_location;
var projection_location;
var ctm = [[1.0, 0.0, 0.0, 0.0],
             [0.0, 1.0, 0.0, 0.0],
             [0.0, 0.0, 1.0, 0.0],
             [0.0, 0.0, 0.0, 1.0]];
var model_view;
var projection;
var sphere_1_ctm = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
var shape = World();
var cShape = 0;

function display()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(ctm));
    // gl.drawArrays(gl.TRIANGLES, 0, shape.length);

    gl.uniformMatrix4fv(model_view_location, false, to1DF32Array(model_view));
    gl.uniformMatrix4fv(projection_location, false, to1DF32Array(projection));

    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(ctm));
    gl.drawArrays(gl.TRIANGLES, 0, shape.length);
}

function keyDownCallback(event){
    if(event.keyCode == 37){
        var rot = rotateY(0.03);
        var model_mat = toMat(model_view);
        model_view = to2DArray(matMult(rot, model_mat)).arr;
        display();
    }
    if(event.keyCode == 39){
        var rot = rotateY(-0.03);
        var model_mat = toMat(model_view);
        model_view = to2DArray(matMult(rot, model_mat)).arr;
        display();
    }
    if(event.keyCode == 38){
        var rot = rotateX(-0.03);
        var model_mat = toMat(model_view);
        model_view = to2DArray(matMult(rot, model_mat)).arr;
        display();
    }
    if(event.keyCode == 40){
        var rot = rotateX(0.03);
        var model_mat = toMat(model_view);
        model_view = to2DArray(matMult(rot, model_mat)).arr;
        display();
    }
    if(event.keyCode == 65){
        var s = scale(1.2, 1.2, 1.2);
        var mat = toMat(projection);
        projection = to2DArray(matMult(s, mat)).arr;
        display();
    }
    if(event.keyCode == 90){
        var s = scale(0.8, 0.8, 0.8);
        var mat = toMat(projection);
        projection = to2DArray(matMult(s, mat)).arr;
        display();
    }
}

var deg = 0;
function idle(){
    if(deg > 360){
        deg = 0;
    }
    deg += 0.03;
    ctm = to2DArray(rotateY(deg)).arr;
    display();
    requestAnimationFrame(idle);
}

function main()
{
    canvas = document.getElementById("gl-canvas");
    if(initGL(canvas) == -1)
	return -1;
    if(init() == -1)
	return -1;

    document.onkeydown = keyDownCallback; 
    
    display();
    requestAnimationFrame(idle);
}

function World(){
    var positions = [];
    var rect = rectanglePositions(0.8, 0.2, 0.8);
    for(var i = 0; i < rect.length; i++){
        var v = new Vector(rect[i][0], rect[i][1], rect[i][2], rect[i][3]);
        var mat = rotateX(1.588);
        rect[i] = matVecMult(mat, v).arr;
    }
    for(var i = 0; i < rect.length; i++){
        var v = new Vector(rect[i][0], rect[i][1], rect[i][2], rect[i][3]);
        var mat = rotateZ(0.78);
        rect[i] = matVecMult(mat, v).arr;
    }
    positions = positions.concat(rect);

    var circle = szCylinderPositions(0.2, 0.3);
    for(var i = 0; i < circle.length; i++){
        var v = new Vector(circle[i][0], circle[i][1], circle[i][2], circle[i][3]);
        var mat = rotateX(1.565);
        circle[i] = matVecMult(mat, v).arr;
    }
    for(var i = 0; i < circle.length; i++){
        var v = new Vector(circle[i][0], circle[i][1], circle[i][2], circle[i][3]);
        var mat = translate(0, 0.75, 0);
        circle[i] = matVecMult(mat, v).arr;
    }
    positions = positions.concat(circle);

    var circle2 = szCylinderPositions(0.2, 0.3)
    cShape = circle2.length;
    for(var i = 0; i < circle.length; i++){
        var v = new Vector(circle2[i][0], circle2[i][1], circle2[i][2], circle2[i][3]);
        var mat = rotateX(1.565);
        circle2[i] = matVecMult(mat, v).arr;
    }
    for(var i = 0; i < circle2.length; i++){
        var v = new Vector(circle2[i][0], circle2[i][1], circle2[i][2], circle2[i][3]);
        var mat = translate(0.75, 0, 0);
        circle2[i] = matVecMult(mat, v).arr;
    }
    positions = positions.concat(circle2);
    return positions;
}