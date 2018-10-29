import {DisplayContainer} from "./DisplayContainer.js";
import {VertexData} from "../utils/VertexData.js";
import {Shader} from "../shader/Shader.js";
import {Status} from "../debug/Status.js";

//批量渲染Sprite，只要材质相同，就有合并drawcall的能力，减少cpu到gpu的耗时
export class BatchSprite extends DisplayContainer{
  constructor(texture,width,height){
    super(width,height);
    this.makeGLTexture(texture);
    this._shader = new Shader(this.gl,"js/mona/shader/simpleTexture-vext.glsl","js/mona/shader/simpleTexture-frag.glsl",this.onShaderInitComplete.bind(this));
  }

  onShaderInitComplete(shaderProgram)
  {
    this._shaderProgram = shaderProgram;
    this.renderReady = true;
  }

  AddSprite(sprite)
  {
    //todo 判断是否可以batch

    this.CheckVertextData();

    this.AddChild(sprite);

    sprite.ExpandVertextToBatch();
  }


  RemoveSprite(sprite)
  {
    this.CheckVertextData();

    this.RemoveChild(sprite);
  }


  _vFillVertices()
  {

    this.CheckVertextData();

    this.vertextData.SetVertextPosition(0,0,0);
    this.vertextData.SetTextureCoords(0,0,1);

    this.vertextData.SetVertextPosition(1,0,0);
    this.vertextData.SetTextureCoords(1,0,1);

    this.vertextData.SetVertextPosition(2,0,this.height);
    this.vertextData.SetTextureCoords(2,0,0);

    this.vertextData.SetVertextPosition(3,this.width,0);
    this.vertextData.SetTextureCoords(3,1,1);

    this.vertextData.SetVertextPosition(4,this.width,this.height);
    this.vertextData.SetTextureCoords(4,1,0);

    this.vertextData.SetVertextPosition(5,this.width,this.height);
    this.vertextData.SetTextureCoords(5,1,0);
  }

  CheckVertextData()
  {
    if(!this.vertextData)
    {
      this.vertextData = new VertexData(true);
    }
  }

  Render(deltaTime)
  {

    if(!this._shaderProgram)
    {
      return;
    }

    //todo 暂时没有考虑嵌套
    for ( let i = 0; i <this.Children.length; i++){
      this.vertextData.AppendBatchVertices(this.Children[i].vertextData,i,this.Children[i].GetTransformMatrix2Target(this));
    }

    this._vFillBuffer();
    this._vFillUniform();
    Status.AddDrawCount();
  }

  // 将文字放在画布中间
  makeGLTexture(bitmapData) {

    let gl = this.gl;
    //创建纹理对象
    var texture = gl.createTexture();
    //获取u_Sampler的存储位置

    //1.对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //4.配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //5.配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
    this._texture = texture;
  }

  _vFillBuffer()
  {
    let gl = this.gl;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER,this.vertextData.vertices,gl.STATIC_DRAW);

    var FSIZE = this.vertextData.BYTES_PER_ELEMENT;

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
    //获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(this._shaderProgram, 'u_Sampler');

    //1.对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //2.开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, this._texture);

    //6.将0号纹理图像传递给着色器
    gl.uniform1i(u_Sampler, 0);
    // 清空 <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertextData.vertextNum);
  }

}
