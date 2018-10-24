import { Vector2 } from "./Vector2.js";
import {MathUtility} from "./MathUtility.js";

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
    mat3.rotate(this._transformMatrix,this._transformMatrix,MathUtility.degToRad(this.localRotation));
    mat3.scale(this._transformMatrix,this._transformMatrix,this.localScale.toArray());

    // var projectionMatrix = mat3.create();
    // mat3.projection(projectionMatrix,640,480);
    // var finalMatrix = mat3.create();
    // mat3.multiply(finalMatrix,projectionMatrix,this._transformMatrix);

    //实现2，这种直接用mat4算，结果不用再转
    //mat4.identity(this._transformMatrix);
    //mat4.translate(this._transformMatrix,this._transformMatrix,this.localPosition.toArray3(0));
    //mat4.rotateZ(this._transformMatrix,this._transformMatrix,this.localRotation);
    //mat4.scale(this._transformMatrix,this._transformMatrix,this.localScale.toArray3(1));
    //var orthMatrix = mat4.create();
    //mat4.ortho(orthMatrix,0,640,480,0,-1,1);
    //mat4.multiply(this._transformMatrix,orthMatrix,this._transformMatrix);
    //return this._transformMatrix;

    return this._transformMatrix;
  }
}
