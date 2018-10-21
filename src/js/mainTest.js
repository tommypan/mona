function Test1() {
  //获取canvas元素
  var canvas = document.getElementById('canvas');
//获取绘制二维上下文
  var ctx = canvas.getContext('2d');
  ctx.fillStyle ='rgba(255,0,0,1.0)';//设置填充色为红色
  ctx.fillRect(0,0,200,200);//使用填充色填充为矩形

}

/**
 * Created by HBX on 2016/12/3.
 */
window.onload = function () {

  //顶点着色器程序
  var VSHADER_SOURCE =
    "attribute vec4 a_Position;" +
    "uniform mat4 u_xformMatarix;" +
    "void main() {" +
    //设置坐标
    "gl_Position = u_xformMatarix * a_Position;" +
    "} ";

  //片元着色器
  var FSHADER_SOURCE =
    "void main() {" +
    //设置颜色
    "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);" +
    "}";
  //获取canvas元素
  var canvas = document.getElementById('canvas');
  //获取绘制二维上下文
  var gl = canvas.getContext('webgl');
  if (!gl) {
    console.log("Failed");
    return;
  }
  //编译着色器
  var vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, VSHADER_SOURCE);
  gl.compileShader(vertShader);

  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, FSHADER_SOURCE);
  gl.compileShader(fragShader);
  //合并程序
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);


  //获取坐标点
  var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  var n = initBuffers(gl,shaderProgram);

  var Tx = 0.5,Ty = 0.5,Tz = 0.0;
//注意WebGL的矩阵式列主序的
  var xformMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    Tx, Ty, Tz, 1.0
  ]);
//然后将矩阵传输给定点着色器
  var u_xformMatarix = gl.getUniformLocation(shaderProgram,'u_xformMatarix');
  gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);


  if(n<0){
    console.log('Failed to set the positions');
    return;
  }
  // 清除指定<画布>的颜色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空 <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initBuffers(gl,shaderProgram) {
  var vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  var n = 3;//点的个数
  //创建缓冲区对象
  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log("Failed to create the butter object");
    return -1;
  }
  //将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
  //向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  //获取坐标点
  var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
  //将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  //连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);
  return n;

}
