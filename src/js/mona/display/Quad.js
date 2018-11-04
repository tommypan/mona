import {DisplayObject} from "./DisplayObject.js";
import {VertexData} from "../utils/VertexData.js";

export class Quad extends DisplayObject{

  constructor(width,height){
    super(width,height);
    this._texture = false;
  }


  _vFillVertices()
  {

    if(!this.vertextData)
    {
      this.vertextData = new VertexData();
    }

    this.vertextData.SetVertextPosition(0,0,0);
    this.vertextData.SetTextureCoords(0,0,1);

    this.vertextData.SetVertextPosition(1,0,this.height);
    this.vertextData.SetTextureCoords(1,0,0);

    this.vertextData.SetVertextPosition(2,this.width,0);
    this.vertextData.SetTextureCoords(2,1,1);

    this.vertextData.SetVertextPosition(3,this.width,this.height);
    this.vertextData.SetTextureCoords(3,1,0);

  }

  ExpandVertextToBatch()
  {
    this.vertextData.ExpandVertextToBatch();
  }

  //vitual private
  //当顶点或者纹理(attribute)等需要重建时
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
    this._shader.Draw(this.vertextData.vertextNum);
  }

}
