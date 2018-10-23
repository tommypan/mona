import { Quad } from "../display/Quad.js";
import { Shader } from "../shader/Shader.js";
import {TextFormat} from "./TextFormat.js";

var textCtx = document.createElement("canvas").getContext("2d");


export class Text extends Quad{
  constructor(content,textFormat,width,height)
  {
    super(width,height);

    this.textTex = false;
    this.textFormat = textFormat ? textFormat : new TextFormat();
    this._shader = new Shader(this.gl,"js/mona/shader/text-vext.glsl","js/mona/shader/text-frag.glsl",this.onShaderInitComplete.bind(this));
    this._content = content;

    this._shaderProgram = false;
    this.makeTextCanvas(100,26);
  }

  onShaderInitComplete(shaderProgram)
  {
    //todo 这块还要好好的抽象
    //1.1怎么产生indices
    //1.2z怎么设置属性
    //1.3怎么绑定缓冲区
    this._shaderProgram = shaderProgram;
  }

  // 将文字放在画布中间
  makeTextCanvas(width,height) {
    textCtx.canvas.width = width;
    textCtx.canvas.height = height
    textCtx.font = this.textFormat.font;
    textCtx.textAlign = this.textFormat.textAlign;
    textCtx.textBaseline = this.textFormat.textBaseline;
    textCtx.fillStyle = this.textFormat.fillStyle;
    textCtx.clearRect(0, 0, width, height);
    textCtx.fillText(this._content, width/2, height/2);
    let gl = this.gl;
    var textTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCtx.canvas);
// 确保即使不是 2 的整数次幂也能渲染
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.textTex = textTex;
    //this._vOnRender();
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

    let gl = this.gl;
    gl.useProgram(this._shaderProgram);


    var mvpMatarix = gl.getUniformLocation(this._shaderProgram,'mvpMatarix');
    gl.uniformMatrix4fv(mvpMatarix, false, this.TransformMatrix);

    //1.对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //2.开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, this.textTex);


    var u_Sampler = gl.getUniformLocation(this._shaderProgram,'u_Sampler');
    gl.uniform1i(u_Sampler, 0);


    //绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertextNum);
  }


}
