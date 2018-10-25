/**
 * Created by HBX on 2016/12/3.
 */
window.onload = function () {
//顶点着色器程序
  var VSHADER_SOURCE =
    "attribute vec4 a_Position;" +
    "uniform mat4 u_xformMatarix;" +
    "attribute vec2 a_TextCoord;" + // 接受纹理坐标
    "varying vec2 v_TexCoord;" +    // 传递纹理坐标
    "void main() {" +
    //设置坐标
    "gl_Position = u_xformMatarix * a_Position;" +//设置坐标
    //设置纹素
    "v_TexCoord = a_TextCoord; " +  // 设置纹理坐标
    "} ";

  //片元着色器
  var FSHADER_SOURCE =
    "precision mediump float;" +  //需要声明浮点数精度，否则报错No precision specified for (float)
    "uniform sampler2D u_Sampler;" + // 取样器
    "varying vec2 v_TexCoord;" +  // 接受纹理坐标
    "void main() {" +
    //设置颜色
    "gl_FragColor = texture2D(u_Sampler, v_TexCoord);" +  // 设置颜色
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



  if(n<0){
    console.log('Failed to set the positions');
    return;
  }

  initTexture(gl, shaderProgram, n)
}

function initBuffers(gl, shaderProgram) {
  //顶点坐标和颜色
  var vertices = new Float32Array([
    -0.05,  0.068,   0.0, 1.0,
    -0.05, -0.068,   0.0, 0.0,
    0.05,  0.068,   1.0, 1.0,
    0.05, -0.068,   1.0, 0.0
  ]);

/*  var vertices = new Float32Array([
    -1,  1,   0.0, 1.0,
    -1, 0.864,   0.0, 0.0,
    -0.9, 1,   1.0, 1.0,
    -0.9, 0.864,   1.0, 0.0
  ]);*/

  var n = 4;//点的个数
  //创建缓冲区对象
  var vertexBuffer = gl.createBuffer();

  //将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
  //向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

  var FSIZE = vertices.BYTES_PER_ELEMENT;

  //获取坐标点
  var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  //将缓冲区对象分配给a_Position变量
  // 告诉属性怎么从 positionBuffer (ARRAY_BUFFER) 中读取位置
  var size = 3;          // 每次迭代使用 3 个单位的数据
  var type = gl.FLOAT;   // 单位数据类型是32位的浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0;        // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
  var offset = 0;        // 从绑定缓冲的起始处开始

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);//shader索引，元素个数，浮点型的常量,
  //连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  //获取Color坐标点
  var a_TextCoord = gl.getAttribLocation(shaderProgram, "a_TextCoord");
  //将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
  //连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_TextCoord);
  return n;
}

function initTexture(gl, shaderProgram, n){
  //创建纹理对象
  var texture = gl.createTexture();
  //获取u_Sampler的存储位置
  var u_Sampler = gl.getUniformLocation(shaderProgram, 'u_Sampler');

  //trqanslate
  var Tx = 0.5,Ty = 0.5,Tz = 0.0;
//注意WebGL的矩阵式列主序的
  var transLateMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    Tx, Ty, Tz, 1.0
  ]);
  //然后将矩阵传输给定点着色器
  //var u_xformMatarix = gl.getUniformLocation(shaderProgram,'u_xformMatarix');
  //gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);

  //rotation
  //旋转角度
  var ANGLE = 45.0;

// 将旋转图形所需的数据传输给定点着色器
  var radian = Math.PI*ANGLE/180.0;//转化为弧度
  var cosB = Math.cos(radian);
  var sinB = Math.sin(radian);

  var rotationMatrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  //var u_xformMatarix = gl.getUniformLocation(shaderProgram,'u_xformMatarix');
  //gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);

  //scale
  var Sx = 3.0;Sy =3; Sz = 3.0;
  var scaleMatrix = new Float32Array([
    Sx, 0.0, 0.0, 0.0,
    0.0, Sy, 0.0, 0.0,
    0.0, 0.0, Sz, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  //var u_xformMatarix = gl.getUniformLocation(shaderProgram,'u_xformMatarix');
  //gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);
  var finalMatrix = mat4.create()
  mat4.multiply(finalMatrix,transLateMatrix,rotationMatrix);
  mat4.multiply(finalMatrix,finalMatrix,scaleMatrix);
  //finalMatrix.multiply(scaleMatrix);
  var u_xformMatarix = gl.getUniformLocation(shaderProgram,'u_xformMatarix');
  gl.uniformMatrix4fv(u_xformMatarix, false, finalMatrix);
  //创建image对象
  var image = new Image();

  //加载纹理
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
  // 浏览器开始加载图片 注意：一定是2^mx2^n尺寸的图片
  image.src = "img/drive.jpg";
  return true;

}

function loadTexture(gl, n, texture, u_Sampler,image){
  //1.对纹理图像进行Y轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //2.开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  //3.向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //4.配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //5.配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  //6.将0号纹理图像传递给着色器
  gl.uniform1i(u_Sampler, 0);
  // 清空 <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //绘制矩形
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
