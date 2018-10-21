import { Transform } from "../utils/Transform.js";
import {Vector2} from "../utils/Vector2.js";

//默认中心点为左上角
export class DisplayContainer
{

  constructor(width,height)
  {
    var canvas = document.getElementById('canvas');
    //获取绘制二维上下文
    this.gl = canvas.getContext('webgl');
    if (!this.gl) {
      console.log("webgl init Failed");
      return;
    }

    this._parent = false; //readonly
    this._root = false;//readonly
    this._transform = new Transform();
    this.localPosition = new Vector2(0,0);
    this.localRotation = 0;
    this.localScale = new Vector2(0,0);
    this.width = width;
    this.height = height;
    this._children = new Array();
    this._shader = false;
    this.isDirty = false;
  }

  AddChild(child)
  {
    if((child instanceof  DisplayContainer) == false)
    {
      console.log("DisplayContainer AddChild error");
      return;
    }

    child._parent = this;
    child._root = this.root;
    this._children.push(child);
    child._vFillVertices();
    child.UpdateGlobalTransform();
    this.MarkasDirty();
  }

  RemoveChild(child)
  {
    if((child instanceof  DisplayContainer) == false)
    {
      console.log("DisplayContainer RemoveChild error");
      return;
    }

    this.MarkasDirty();
    child._parent = false;
    child._root = false;
    this._children.splice( this._children.indexOf( child ), 1 );
    child.UpdateGlobalTransform();
  }

  //更新位置，旋转灯信息。常发生在添加或者移除displaycontainer时
  UpdateGlobalTransform()
  {
    this.localPosition = this.localPosition;
  }

  LocalToGlobal(point)
  {
    if((point instanceof  Vector2) == false)
    {
      console.log("DisplayContainer LocalToGlobal error");
      return new Vector2(0,0);
    }

    //todo 没有考虑旋转
    if(this._parent)
    {
      let x = this._parent.position.x + this._transform.scale.x * point.x;
      let y = this._parent.position.y + this._transform.scale.y * point.y;
      return new Vector2(x,y);
    }else
    {
      return new Vector2(0,0);
    }


  }

  GlobalToLocal(point)
  {
    if((point instanceof  Vector2) == false)
    {
      console.log("DisplayContainer GlobalToLocal error");
      return;
    }

    //todo 没有考虑旋转
    if(this._parent)
    {
      let x = point.x - (this._parent.position.x + this._transform.scale.x);
      let y = point.y - (this._parent.position.y + this._transform.scale.y);
      return new Vector2(x,y);
    }else
    {
      return new Vector2(0,0);
    }
  }

  get width() {
    return this._width;
  }
  set width(value) {
    if(isNaN(value))
    {
      console.log("DisplayContainer set width error");
      return;
    }
    this._width = value;
    this._vFillVertices();
  }

  get height() {
    return this._height;
  }
  set height(value) {
    if(isNaN(value))
    {
      console.log("DisplayContainer set height error");
      return;
    }
    this._height = value;
    this._vFillVertices();
  }

  get parent() {
    return this._parent;
  }

  get root() {
    return this._root;
  }

  get TransformMatrix()
  {
    return this._transform.transformMatrix;
  }

  get localPosition() {
    return this._transform.localPosition;
  }
  set localPosition(value) {
    if((value instanceof  Vector2) == false)
    {
      console.log("DisplayContainer set localPosition error");
      return;
    }
    this._transform.localPosition = value;
    this._transform.position = this.LocalToGlobal(value);
    this.MarkasDirty();
  }

  get position() {
    return this._transform.position;
  }
  set position(value) {
    if((value instanceof  Vector2) == false)
    {
      console.log("DisplayContainer set localPosition error");
      return;
    }
    this._transform.localPosition = this.GlobalToLocal(value)
    this._transform.position = value;
    this.MarkasDirty();
  }

  get localRotation() {
    return this._transform.localRotation;
  }
  set localRotation(value) {
    if(isNaN(value))
    {
      console.log("DisplayContainer set localRotation error");
      return;
    }
    this._transform.localRotation = value;
    this.MarkasDirty();
  }

  get localScale() {
    return this._transform.localScale;
  }
  set localScale(value) {
    if((value instanceof  Vector2) == false)
    {
      console.log("DisplayContainer set localScale error");
      return;
    }
    this._transform.localScale = value;
    //todo
    this._transform.scale = new Vector2(1,1);
    this.MarkasDirty();
  }

  get Children()
  {
    return this._children;
  }

  MarkasDirty()
  {
    if(this._root)
    {
      this._root.isDirty = true;
    }

  }

  //vitual private
  //模型的顶点数据
  _vFillVertices ()
  {
  }

  //vitual private
  //当顶点或者纹理(attribute)等需要重建时
  _vFillBuffer()
  {

  }

  //vitual private
  //unifonm参数发生变化
  _vFillUniform()
  {

  }

  Render()
  {
      this._vFillBuffer();

      this._vFillUniform();
  }

}
