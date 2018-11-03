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

    this.vertextData.ClearRestBatchVertext(this.Children.length+1);
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
    this.width = this.defaultWidth ;
    this.height = this.defaultHeight;
    this._texture = texture;
  }

  _vFillBuffer()
  {

    this._shader.CreateBuffer(this.vertextData.vertices);


    var FSIZE = this.vertextData.BYTES_PER_ELEMENT;
    this._shader.SetAttribute("a_Position",FSIZE,0);
    this._shader.SetAttribute("a_TextCoord",FSIZE,2);

  }

  //vitual private
  //unifonm参数发生变化
  _vFillUniform()
  {
    super._vFillUniform();

    let gl = this.gl;

    this._shader.SetTexture(this._texture,"u_Sampler",0);

    //绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertextData.vertextNum);
  }

}
