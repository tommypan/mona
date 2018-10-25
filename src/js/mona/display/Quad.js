import {DisplayObject} from "./DisplayObject.js";

export class Quad extends DisplayObject{

  constructor(width,height){
    super(width,height);
    this._vertices = new Float32Array([ //readyonly
      0.0,  0.0,   0.0, 1.0,
      -0.0, -0.0,   0.0, 0.0,
      0.0,  0.0,   1.0, 1.0,
      0.0, -0.0,   1.0, 0.0
    ]);
    this.vertextNum = 4;
  }


  _vFillVertices()
  {

    this._vertices = new Float32Array([
      0,  0,   0.0, 1.0, //左上
      0, this.height,   0.0, 0.0,//左下
      this.width,  0,   1.0, 1.0,//右上
      this.width, this.height,   1.0, 0.0//右下
    ]);
  }
}
