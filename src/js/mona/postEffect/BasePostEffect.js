//在所有渲染树流程完成之后，给用户一个后处理的机会，实现各种现代后处理效果
import {RenderSupport} from "../rendering/RenderSupport.js";
import {Status} from "../debug/Status.js";

export class BasePostEffect {

  constructor()
  {
    var canvas = document.getElementById('canvas');
    //获取绘制二维上下文
    this.gl = canvas.getContext('webgl');
    if (!this.gl) {
      console.log("webgl init Failed");
      return;
    }
  }

  RenderImage(parentContainer,source)
  {
   Status.DrawCallCount ++;
   this.onRenderImage(parentContainer,source);
  }
  /**
   * 后处理
   * @param parentContainer 此fboTexture的父容器.方便自定义后处理拿到显示列表做高级效果
   * @param source 目标fbo纹理
   */
  onRenderImage(parentContainer,source)
  {
    let gl = this.gl;

    //var bound = source.bounds;

    //默认处理
    var VSHADER_SOURCE =
      "attribute vec4 a_Position;" +
      "attribute vec2 a_TextCoord;" + // 接受纹理坐标
      "varying vec2 v_TexCoord;" +    // 传递纹理坐标
      "void main() {" +
      //设置坐标
      "gl_Position = a_Position;" +//设置坐标
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

    // var vertices = new Float32Array([
    //   bound.width/2,  0,   0.0, 1.0,
    //   0, bound.height,   0.0, 0.0,
    //   bound.width,  0,   1.0, 1.0,
    //   bound.width, bound.height,   1.0, 0.0
    // ]);

    var vertices = new Float32Array([
      -1,  1,   0.0, 1.0,
      -1, -1,   0.0, 0.0,
      1,  1,   1.0, 1.0,
      1, -1,   1.0, 0.0
    ]);

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
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);//shader索引，元素个数，浮点型的常量,
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //获取Color坐标点
    var a_TextCoord = gl.getAttribLocation(shaderProgram, "a_TextCoord");
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_TextCoord);

    //var mvpMatrix = gl.getUniformLocation(shaderProgram,'mvpMatrix');
    //gl.uniformMatrix4fv(mvpMatrix, false, mat4.create());

    //2.开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, source.glFBOTexture);
    //获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(shaderProgram, 'u_Sampler');
    //6.将0号纹理图像传递给着色器
    gl.uniform1i(u_Sampler, 0);

    //绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}
