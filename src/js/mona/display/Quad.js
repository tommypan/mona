import {DisplayObject} from "./DisplayObject.js";
import {VertexData} from "../utils/VertexData.js";

export class Quad extends DisplayObject{

  constructor(width,height){
    super(width,height);
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
}
