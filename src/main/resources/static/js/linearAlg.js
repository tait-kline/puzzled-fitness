//methods for vector
function printVec(v){
    var str = "[";
    for(let i = 0; i < v.arr.length; i++){
        if(i == v.arr.length - 1){
            str += v.arr[i].toFixed(4);
        }else{
            str += v.arr[i].toFixed(4) + ", ";
        }
    }
    str += "]";
    return str;
}
function vecMult(s, v){
    var res = [];
    for(let i = 0; i < v.arr.length; i++){
        res[i] = s * v.arr[i];
    }
    var vecres = new Vector(res[0], res[1], res[2], res[3]);
    return vecres;
}
function addVec(x, y){
    var sum = [];
    for(let i = 0; i < x.arr.length; i++){
        sum[i] = x.arr[i] + y.arr[i];
    }
    var newvec = new Vector(sum[0], sum[1], sum[2], sum[3]);
    return newvec;
}
function subVec(x, y){
    var dif = [];
    for(let i = 0; i < x.arr.length; i++){
        dif[i] = x.arr[i] - y.arr[i];
    }
    var newvec = new Vector(dif[0], dif[1], dif[2], dif[3]);
    return newvec;
}
function mag(v){
    var m = 0;
    for(let i = 0; i < v.arr.length; i++){
        m += v.arr[i]**2;
    }
    return Math.sqrt(m);
}
function normalize(v){
    var s = 1 / mag(v);
    return vecMult(s, v);
}
function product(x, y){
    return (x.arr[0] * y.arr[0]) + (x.arr[1] * y.arr[1]) + (x.arr[2] * y.arr[2]) + (x.arr[3] * y.arr[3]);
}
function crossProd(x, y){
    var stuff = [];
    stuff[0] = (x.arr[1] * y.arr[2]) - (x.arr[2] * y.arr[1]);
    stuff[1] = (x.arr[2] * y.arr[0]) - (x.arr[0] * y.arr[2]);
    stuff[2] = (x.arr[0] * y.arr[1]) - (x.arr[1] * y.arr[0]);
    return new Vector(stuff[0], stuff[1], stuff[2], 0);
}
//vector object
function Vector(x, y, z, w){
    this.arr = [x, y, z, w];
}
//Matrix object
function Matrix(x, y, z, w){
    this.arr = [x, y, z, w];
}
//Matrix methods
function printMat(m){
    var str = "[";
    for(let i = 0; i < m.arr.length; i++){
        if(i == m.arr.length - 1){
            str = str + printVec(m.arr[i]);
        }else{
            str = str + printVec(m.arr[i]) + ", ";
        }
    }
    str = str + "]";
    return str;
}

function scalMatMult(s, m){
    var res = [];
    for(let i = 0; i < m.arr.length; i++){
        res[i] = vecMult(s, m.arr[i]);
    }
    var newmat = new Matrix(res[0], res[1], res[2], res[3]);
    return newmat;
}

function addMat(x, y){
    var sum = [];
    for(let i = 0; i < x.arr.length; i++){
        sum[i] = addVec(x.arr[i], y.arr[i]);
    }
    var newmat = new Matrix(sum[0], sum[1], sum[2], sum[3]);
    return newmat;
}

function subMat(x, y){
    var sum = [];
    for(let i = 0; i < x.arr.length; i++){
        sum[i] = subVec(x.arr[i], y.arr[i]);
    }
    var newmat = new Matrix(sum[0], sum[1], sum[2], sum[3]);
    return newmat;
}

function matVecMult(m, v){
    var result = [];
    for(let i = 0; i < m.arr.length; i++){
        result[i] = vecMult(v.arr[i], m.arr[i]);
    }
    var vec = addVec(result[0], result[1]);
    var vec1 = addVec(result[2], result[3]);
    var vec2 = addVec(vec, vec1);
    return vec2;
}

function matMult(x, y){
    var result = [];
    for(let i = 0; i < y.arr.length; i++){
        result[i] = matVecMult(x, y.arr[i]);
    }
    var mat = new Matrix(result[0], result[1], result[2], result[3]);
    return mat;
}

function transpose(m){
    var res = [];
    res[0] = new Vector(m.arr[0].arr[0], m.arr[1].arr[0], m.arr[2].arr[0], m.arr[3].arr[0]);
    res[1] = new Vector(m.arr[0].arr[1], m.arr[1].arr[1], m.arr[2].arr[1], m.arr[3].arr[1]);
    res[2] = new Vector(m.arr[0].arr[2], m.arr[1].arr[2], m.arr[2].arr[2], m.arr[3].arr[2]);
    res[3] = new Vector(m.arr[0].arr[3], m.arr[1].arr[3], m.arr[2].arr[3], m.arr[3].arr[3]);
    return new Matrix(res[0], res[1], res[2], res[3]);
}

function inverse(m){
    var min = minor(m);
    var co = cofactor(min);
    var trans = transpose(co);
    var determinant = (m.arr[0].arr[0]*min.arr[0].arr[0]) - (m.arr[1].arr[0]*min.arr[1].arr[0]) + (m.arr[2].arr[0]*min.arr[2].arr[0]) - (m.arr[3].arr[0]*min.arr[3].arr[0]);
    var inverse = scalMatMult((1/determinant), trans);
    return inverse;
}

function cofactor(m){
    var one = -1;
    var mat = [];
    for(let i = 0; i < m.arr.length; i++){
        var temp = [];
        one = one * -1;
        for(let j = 0; j < m.arr[i].arr.length; j++){
            temp[j] = m.arr[i].arr[j] * one;
            one = one * -1;
        }
        mat[i] = temp;
    }
    var v = new Vector(mat[0][0], mat[0][1], mat[0][2], mat[0][3]);
    var v1 = new Vector(mat[1][0], mat[1][1], mat[1][2], mat[1][3]);
    var v2 = new Vector(mat[2][0], mat[2][1], mat[2][2], mat[2][3]);
    var v3 = new Vector(mat[3][0], mat[3][1], mat[3][2], mat[3][3]);
    return new Matrix(v, v1, v2, v3);
}

function minor(m){
    var mat = [];
    mat[0] = new Vector(determinant(0, 0, m), determinant(1, 0, m), determinant(2, 0, m), determinant(3, 0, m));
    mat[1] = new Vector(determinant(0, 1, m), determinant(1, 1, m), determinant(2, 1, m), determinant(3, 1, m));
    mat[2] = new Vector(determinant(0, 2, m), determinant(1, 2, m), determinant(2, 2, m), determinant(3, 2, m));
    mat[3] = new Vector(determinant(0, 3, m), determinant(1, 3, m), determinant(2, 3, m), determinant(3, 3, m));
    return new Matrix(mat[0], mat[1], mat[2], mat[3]);
}

function determinant(i, j, m){
    var a = [];
    var ind1 = 0;
    for(let x = 0; x < m.arr.length; x++){
        var temp = [];
        var ind = 0;
        for(let y = 0; y < m.arr[x].arr.length; y++){
            if(y != i && x != j){
                temp[ind] = m.arr[x].arr[y];
                ind++;
            }
        }
        if(temp.length != 0){
            a[ind1] = temp;
            ind1++;
        }
    }
    return (a[0][0]*a[1][1]*a[2][2])+(a[1][0]*a[2][1]*a[0][2])+(a[2][0]*a[0][1]*a[1][2])-(a[0][0]*a[2][1]*a[1][2])-(a[1][0]*a[0][1]*a[2][2])-(a[2][0]*a[1][1]*a[0][2]);
}
