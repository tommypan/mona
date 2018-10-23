import { Vector2 } from "./Vector2.js";

export class Transform {

  constructor() {
    this._localPosition = false;
    this._localRotation = false;
    this._localScale =  false;

    this._transformMatrix = mat3.create();
  }

  get localPosition()
  {
    return this._localPosition;
  }
  set localPosition(value)
  {
    if((value instanceof  Vector2)== false)
    {
      console.log("Transform set posion error");
      return;
    }

    this._localPosition = value;
  }

  get localRotation()
  {
    return this._localRotation;
  }

  set localRotation(value)
  {
    this._localRotation = value;
  }

  get localScale()
  {
    return this._localScale;
  }

  set localScale(value)
  {
    if((value instanceof  Vector2)== false)
    {
      console.log("Transform set scale error");
      return;
    }

    this._localScale = value;
  }

  get transformMatrix()
  {
    mat3.identity(this._transformMatrix);
    mat3.translate(this._transformMatrix,this._transformMatrix,this.localPosition.toArray());
    mat3.rotate(this._transformMatrix,this._transformMatrix,this.localRotation);
    mat3.scale(this._transformMatrix,this._transformMatrix,this.localScale.toArray());
    var orthMatrix = mat3.create();
    mat3.projection(orthMatrix,640,480);
    var finalMatrix = mat3.create();
    mat3.multiply(finalMatrix,orthMatrix,this._transformMatrix);

    //实现2，这种直接用mat4算，结果不用再转
    //mat4.identity(this._transformMatrix);
    //mat4.translate(this._transformMatrix,this._transformMatrix,this.localPosition.toArray3(0));
    //mat4.rotateZ(this._transformMatrix,this._transformMatrix,this.localRotation);
    //mat4.scale(this._transformMatrix,this._transformMatrix,this.localScale.toArray3(1));
    //var orthMatrix = mat4.create();
    //mat4.ortho(orthMatrix,0,640,480,0,-1,1);
    //mat4.multiply(this._transformMatrix,orthMatrix,this._transformMatrix);
    //return this._transformMatrix;

    return this.convertToMat4(finalMatrix);
  }

  convertToMat4(mat3)
  {
    var target = mat4.create();
    target[0] = mat3[0];
    target[1] = mat3[1];
    target[4] = mat3[3];
    target[5] = mat3[4];
    target[12] = mat3[6];
    target[13] = mat3[7];
    return target;
  }
}
