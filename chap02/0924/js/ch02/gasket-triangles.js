"use strict";  

const { vec3 } = glMatrix;  

var canvas;  
var gl;  

var points = [];  
var numTimesToSubdivide = 5; // 初始细分次数  

window.onload = function initTriangles() {  
    canvas = document.getElementById("gl-canvas");  
    gl = canvas.getContext("webgl2");  

    if (!gl) {  
        alert("WebGL isn't available");  
    }  

    // 设置细分次数输入框的事件处理  
    document.getElementById("setSubdivision").onclick = function() {  
        var inputValue = document.getElementById("subdivisionInput").value;  
        var newSubdivision = parseInt(inputValue, 10);  
        
        // 确保细分次数为有效的非负整数  
        if (!isNaN(newSubdivision) && newSubdivision >= 0) {  
            numTimesToSubdivide = newSubdivision;  
            render();  
        }  
    };  

    render();  
};  

function render() {  
    // 每次渲染之前清空 points 数组  
    points = [];  
    
    // 初始化三角形的顶点  
    var vertices = [  
        -1, -1,  0,  
         0,  1,  0,  
         1, -1,  0  
    ];  

    var u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);  
    var v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);  
    var w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);  

    divideTriangle(u, v, w, numTimesToSubdivide);  
    
    // 配置 WebGL  
    gl.viewport(0, 0, canvas.width, canvas.height);  
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  
    
    // 加载着色器程序  
    var program = initShaders(gl, "vertex-shader", "fragment-shader");  
    gl.useProgram(program);  
    
    // 加载数据到 GPU  
    var vertexBuffer = gl.createBuffer();  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);  

    // 关联着色器变量  
    var vPosition = gl.getAttribLocation(program, "vPosition");  
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(vPosition);  
    
    // 渲染三角形  
    gl.clear(gl.COLOR_BUFFER_BIT);  
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);  
}  

function triangle(a, b, c) {  
    points.push(a[0], a[1], a[2]);  
    points.push(b[0], b[1], b[2]);  
    points.push(c[0], c[1], c[2]);  
}  

function divideTriangle(a, b, c, count) {  
    if (count == 0) {  
        triangle(a, b, c);  
    } else {  
        var ab = vec3.create();  
        vec3.lerp(ab, a, b, 0.5);  
        var bc = vec3.create();  
        vec3.lerp(bc, b, c, 0.5);  
        var ca = vec3.create();  
        vec3.lerp(ca, c, a, 0.5);  

        divideTriangle(a, ab, ca, count - 1);  
        divideTriangle(b, bc, ab, count - 1);  
        divideTriangle(c, ca, bc, count - 1);  
    }  
}  