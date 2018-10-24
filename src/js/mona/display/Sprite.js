import { Quad } from "./Quad.js";
import { Shader } from "../shader/Shader.js";

export class Sprite extends Quad{
  constructor(texture,width,height)
  {
    super(width,height);
    this._shader = new Shader(this.gl,"js/mona/shader/simpleTexture-vext.glsl","js/mona/shader/simpleTexture-frag.glsl",this.onShaderInitComplete.bind(this));
    this._texture = texture;
  }

  onShaderInitComplete(shaderProgram)
  {
    //todo 这块还要好好的抽象
    //1.1怎么产生indices
    //1.2z怎么设置属性
    //1.3怎么绑定缓冲区
    this._shaderProgram = shaderProgram;
  }

  //vitual private
  //当顶点或者纹理(attribute)等需要重建时
  _vFillBuffer()
  {
    let gl = this.gl;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER,this._vertices,gl.STATIC_DRAW);

    var FSIZE = this._vertices.BYTES_PER_ELEMENT;

    //获取坐标点
    var a_Position = gl.getAttribLocation(this._shaderProgram, "a_Position");
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
    var a_TextCoord = gl.getAttribLocation(this._shaderProgram, "a_TextCoord");
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_TextCoord);
  }

  //vitual private
  //unifonm参数发生变化
  _vFillUniform()
  {
    super._vFillUniform();

    let gl = this.gl;
    //创建纹理对象
    var texture = gl.createTexture();
    //获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(this._shaderProgram, 'u_Sampler');

    //1.对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //2.开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //4.配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //5.配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this._texture);

    //6.将0号纹理图像传递给着色器
    gl.uniform1i(u_Sampler, 0);
    // 清空 <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertextNum);
  }


}
