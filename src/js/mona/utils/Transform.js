import { Vector2 } from "./Vector2.js";

export class Transform {

  constructor() {
    this.localPosition = false;
    this.localRotation = false;
    this.localScale =  false;
    this._position = false;
    this._rotation= false;
    this._scale = false;
    this._transLateMatrix = false;
    this._rotationMatrix = false;
    this._scaleMatrix = false;

    var ANGLE = 0;
// 将旋转图形所需的数据传输给定点着色器
    var radian = Math.PI*ANGLE/180.0;//转化为弧度
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    this._rotationMatrix  = new Float32Array([
      cosB, sinB, 0.0, 0.0,
      -sinB, cosB, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);

    this._scaleMatrix = new Float32Array([
      1, 0.0, 0.0, 0.0,
      0.0, 1, 0.0, 0.0,
      0.0, 0.0, 1, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);
  }

  get position()
  {
    return this._position;
  }
  set position(value)
  {
    if((value instanceof  Vector2)== false)
    {
      console.log("Transform set posion error");
      return;
    }

    let canvas = document.getElementById('canvas');
    let width = canvas.width;
    let height = canvas.height;
    this._position = value;
    this._transLateMatrix = new Float32Array([
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      2*value.x/width, 2*value.y/height, 0, 1.0
    ]);

  }

  //todo
  get rotation()
  {
    return this._rotation;
  }

  set rotation(value)
  {
    this._rotation = value;


    var ANGLE = 0;
// 将旋转图形所需的数据传输给定点着色器
    var radian = Math.PI*ANGLE/180.0;//转化为弧度
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    this._rotationMatrix  = new Float32Array([
      cosB, sinB, 0.0, 0.0,
      -sinB, cosB, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);
  }

  get scale()
  {
    return this._scale;
  }

  set scale(value)
  {
    if((value instanceof  Vector2)== false)
    {
      console.log("Transform set scale error");
      return;
    }

    this._scale = value;
    this._scaleMatrix = new Float32Array([
      value.x, 0.0, 0.0, 0.0,
      0.0, value.y, 0.0, 0.0,
      0.0, 0.0, 1, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);
  }

  get transformMatrix()
  {
    if(!this._transLateMatrix || !this._rotationMatrix || !this._scaleMatrix)
    {
      console.log("transformMatrix get error");
      return;
    }

    var finalMatrix = mat4.create()
    mat4.multiply(finalMatrix,this._transLateMatrix,this._rotationMatrix);
    mat4.multiply(finalMatrix,finalMatrix,this._scaleMatrix);
    return finalMatrix;
  }

}
