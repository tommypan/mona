import {Vector2} from "../utils/Vector2.js";
import {RenderSupport} from "../rendering/RenderSupport.js";
import {Transform} from "../utils/Transform.js";
import {Status} from "../debug/Status.js";
import {InputEventListener} from "../input/InputEventListener.js";
import {Bound} from "../utils/Bound.js";

//默认中心点为左上角
//显示列表树基类
export class DisplayObject extends InputEventListener{

  constructor(width,height)
  {
    super();
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
    this.localScale = new Vector2(1,1);
    this.width = width;
    this.height = height;
    this._shader = false;
    this.isDirty = false;
    this._shaderProgram = false;
    this.renderReady = false;
  }

  //子节点坐标系的点转换到世界坐标
  LocalToGlobal(point)
  {
    if((point instanceof  Vector2) == false)
    {
      console.log("DisplayObject LocalToGlobal error");
      return new Vector2(0,0);
    }

    if(!this.root)
    {
      console.log("DisplayObject LocalToGlobal error. not add to stage");
      return new Vector2(0,0);
    }

    var result = mat3.create();
    let transformationMatrix = this.GetTransformMatrix2Target(this.root);
    mat3.translate(result,transformationMatrix,point.toArray3(0));
    return new Vector2(result[6],result[7]);
  }

  //世界坐标的点转换到某个子节点坐标系
  GlobalToLocal(point)
  {
    if((point instanceof  Vector2) == false)
    {
      console.log("DisplayObject GlobalToLocal error");
      return;
    }

    if(!this.root)
    {
      console.log("DisplayObject GlobalToLocal error. not add to stage");
      return new Vector2(0,0);
    }

    var result = mat3.create();
    let transformationMatrix = this.GetTransformMatrix2Target(this.root);
    mat3.invert(transformationMatrix,transformationMatrix);
    mat3.translate(result,transformationMatrix,point.toArray3(0));
    return new Vector2(result[6],result[7]);
  }

  //获取当前坐标系相对于目标坐标系的转换矩阵
  GetTransformMatrix2Target(targetObject)
  {
    var transformMatrix = mat3.create();
    if((targetObject instanceof  DisplayObject) == false)
    {
      console.log("DisplayObject GetTransformMatrix2Target error");
      return transformMatrix;
    }

    var curentObject = this;

    if(targetObject == this)
    {
      return mat3.identity(transformMatrix);
    }else if(targetObject == this.parent)
    {
      return this.TransformMatrix;
    }else if(targetObject == this.root || targetObject == this.top)
    {
      curentObject = this;
      let top = this.top;
      while (curentObject.parent != top)
      {
        mat3.multiply(transformMatrix,curentObject.TransformMatrix,transformMatrix);
        curentObject = curentObject.parent;
      }
      mat3.multiply(transformMatrix,curentObject.TransformMatrix,transformMatrix);
      return transformMatrix;
    }

    //如果是渲染树当中的某个节点
    var parentList = [];
    curentObject = this;
    while (curentObject.parent)
    {
      parentList[parentList.length] = curentObject.parent;
      curentObject = this.parent;
    }
    if(parentList.indexOf(targetObject) == -1)
    {
      console.log("DisplayObject GetTransformMatrix2Target error. this not connect to target");
      return mat3.identity(transformMatrix);
    }


    curentObject = this;
    while (curentObject != targetObject)
    {
      mat3.multiply(transformMatrix,transformMatrix,this.TransformMatrix);
      curentObject = this.parent;
    }

    return transformMatrix;
  }

  getBound()
  {
      let minPoint = this.LocalToGlobal(new Vector2(0,0));
      let maxPoint = this.LocalToGlobal(new Vector2(this._width,this._height));

      //这里后面优化，不用每次都实例化一个bound
      return new Bound(minPoint.x,minPoint.y,maxPoint.x-minPoint.x,maxPoint.y-minPoint.y);
  }

  checkVisibleAndAlpha()
  {
    return true;
  }

  //此渲染树的跟.不一定是stage
  get top()
  {
    var result = this;
    while (result.parent)
    {
      result = result.parent;
    }
    return result;
  }

  get width() {
    return this._width;
  }
  set width(value) {
    if(isNaN(value))
    {
      console.log("DisplayObject set width error");
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
      console.log("DisplayObject set height error");
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
      console.log("DisplayObject set localPosition error");
      return;
    }
    this._transform.localPosition = value;
    this.MarkasDirty();
  }

  get localRotation() {
    return this._transform.localRotation;
  }
  set localRotation(value) {
    if(isNaN(value))
    {
      console.log("DisplayObject set localRotation error");
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
      console.log("DisplayObject set localScale error");
      return;
    }
    this._transform.localScale = value;
    this.MarkasDirty();
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
    if(!this._shaderProgram)
    {
      return;
    }

    let gl = this.gl;
    gl.useProgram(this._shaderProgram);

    var mvpMatrix = gl.getUniformLocation(this._shaderProgram,'mvpMatrix');
    gl.uniformMatrix4fv(mvpMatrix, false, RenderSupport.mvpMatrix);
  }

  PreRender()
  {
    this._vPreRender();
  }

  _vPreRender()
  {

  }

  PostRender()
  {
    Status.AddDrawCount();
    this._vPostRender();
  }

  _vPostRender()
  {
    Status.AddDrawCount();
  }


  Render()
  {

    this.PreRender();

    this._vFillBuffer();

    this._vFillUniform();

    this.PostRender();
  }
 }
