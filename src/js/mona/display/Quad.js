import { DisplayContainer } from "./DisplayContainer.js";

export class Quad extends DisplayContainer{

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
    if(this._root == false)
    {
      return;
    }

    if(this._root.width == 0 || this._root.height == 0)
    {
      console.log("Quad _vFillvVrtices root width hight error");
      return;
    }

    let x = this.width/(this._root.width);
    let y = this.height/(this._root.height);
    //默认位置在舞台的左上角
    this._vertices = new Float32Array([
      -1,  1,   0.0, 1.0, //左上
      -1, 1-y,   0.0, 0.0,//左下
      x-1,  1,   1.0, 1.0,//右上
      x-1, 1-y,   1.0, 0.0//右下
    ]);

  }
}
