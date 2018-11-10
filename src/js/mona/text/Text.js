import { Quad } from "../display/Quad.js";
import { Shader } from "../shader/Shader.js";
import {TextFormat} from "./TextFormat.js";

var textCtx = document.createElement("canvas").getContext("2d");


export class Text extends Quad{
  constructor(content,textFormat,width,height)
  {
    super(width,height);

    this.textFormat = textFormat ? textFormat : new TextFormat();
    this._content = content;
    this.makeTextCanvas(100,26);

    this._shader = new Shader(this.gl,"/dist/mona/shader/text-vext.glsl","/dist/mona/shader/text-frag.glsl",this.onShaderInitComplete.bind(this));
  }

  onShaderInitComplete(shaderProgram)
  {
    this._shaderProgram = shaderProgram;
    this.renderReady = true;
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
    this._texture = textTex;
  }

}
