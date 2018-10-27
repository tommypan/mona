import { Quad } from "./Quad.js";
import { Shader } from "../shader/Shader.js";

export class Sprite extends Quad{
  constructor(bitmapData,width,height)
  {
    super(width,height);
    this.makeGLTexture(bitmapData);
    this._shader = new Shader(this.gl,"js/mona/shader/simpleTexture-vext.glsl","js/mona/shader/simpleTexture-frag.glsl",this.onShaderInitComplete.bind(this));

  }

  onShaderInitComplete(shaderProgram)
  {
    this._shaderProgram = shaderProgram;
    this.renderReady = true;
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
      //5.配置纹理图像
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, bitmapData);
    this._texture = texture;
  }

}
