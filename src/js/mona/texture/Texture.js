import {Quad} from "../display/Quad.js";
import {Shader} from "../shader/Shader.js";

//可以通过rtt图直接构造渲染树列表的节点，实现特定后处理效果
export class Texture extends Quad{

  constructor(webGLTexture,vextCustomShader,fragCustomShader,width,height)
  {
    super(width,height);
    this._texture = webGLTexture;
    this._shader = new Shader(this.gl,vextCustomShader,fragCustomShader,this.onShaderInitComplete.bind(this));
  }

  onShaderInitComplete(shaderProgram)
  {
    this._shaderProgram = shaderProgram;
    this.renderReady = true;
  }


}
