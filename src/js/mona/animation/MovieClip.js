import {Quad} from "../display/Quad.js";
import {Shader} from "../shader/Shader.js";

export class MovieClip extends Quad{
  constructor(bitmapDataList,width,height)
  {
    super(width,height);
    this._glTextureList = new Array();
    this._playIndex = 0;
    this._autoPlay = false;
    this.makeGLTexture(bitmapDataList);
    this.playSpeed = 30;
    this._statCountDelta = 0;
    this._shader = new Shader(this.gl,"/dist/mona/shader/simpleTexture-vext.glsl","/dist/mona/shader/simpleTexture-frag.glsl",this.onShaderInitComplete.bind(this));
  }

  onShaderInitComplete(shaderProgram)
  {
    this._shaderProgram = shaderProgram;
    this.renderReady = true;
  }

  Play()
  {
    this._autoPlay = true;
  }

  Stop()
  {
    this._autoPlay = false;
  }

  Reset()
  {
    this._playIndex = 0;
  }

  // 将文字放在画布中间
  makeGLTexture(bitmapDataList)
  {

    let gl = this.gl;

    for (let i = 0; i < bitmapDataList.length; i++)
    {
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapDataList[i].content);
      this._glTextureList[this._glTextureList.length] = texture;
    }
    this.width = this.width == this.defaultWidth ? bitmapDataList[0].content.width : this.width;
    this.height = this.height == this.defaultHeight ? bitmapDataList[0].content.height : this.height;
  }

  _vPreRender(deltaTime)
  {

    if(!this._autoPlay)
    {
      this._texture = this._glTextureList[this._playIndex];
      return;
    }

    if(this._playIndex >= this._glTextureList.length)
    {
      this._playIndex = 0;
    }

    if(this._playIndex < this._glTextureList.length)
    {
      this._texture = this._glTextureList[this._playIndex];
    }

    if(this._statCountDelta + deltaTime < this.playSpeed)
    {
      this._statCountDelta += deltaTime;
      return;
    }else {
      this._statCountDelta = 0;
    }

    this._playIndex++;
  }

}
