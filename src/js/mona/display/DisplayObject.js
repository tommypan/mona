import {Vector2} from "../utils/Vector2.js";
import {RenderSupport} from "../rendering/RenderSupport.js";
import {Transform} from "../utils/Transform.js";
import {Status} from "../debug/Status.js";
import {InputEventListener} from "../input/InputEventListener.js";
import {Bound} from "../utils/Bound.js";
import {BasePostEffect} from "../postEffect/BasePostEffect.js";
import {RenderTexture} from "../texture/RenderTexture.js";
import {GLSeetting} from "../rendering/GLSeetting.js";
import {Shader} from "../shader/Shader.js";

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

    this.defaultWidth = 1;
    this.defaultHeight = 1;
    this._parent = false; //readonly
    this.root = false;//readonly
    this._transform = new Transform();
    this.localPosition = new Vector2(0,0);
    this.localRotation = 0;
    this.localScale = new Vector2(1,1);
    this.width = width ? width : this.defaultWidth;
    this.height = height ? height : this.defaultHeight;
    this._shader = false;
    this.isDirty = false;
    this._shaderProgram = false;
    this.renderReady = false;

    this._needRenderTarget = false;//后处理效果支持.设置来渲染到纹理后，此节点和子节点都会统一渲染到纹理，除非跳出此树
    this._renderTexture = new RenderTexture(false,false);
    this._customPostRender = false;//外部传入指定后处理类
    this._cacheAsBitmap = false;

    this._subShaders = [];
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

  hitTest(bound)
  {
    if((bound instanceof  Bound) == false)
    {
      console.log("DisplayObject hitTest error");
      return;
    }

    return this.getBound().CheckInteractBound(bound);
  }

  checkVisibleAndAlpha()
  {
    return true;
  }

  set customPostRender(value)
  {
    if(value instanceof  BasePostEffect)
    {
      this._customPostRender = value;
      this._needRenderTarget = true;
    }else
    {
      this._customPostRender = false;
      this._needRenderTarget = false;
    }
  }

  /**
   * 缓存为位图，可以通过此技术，可以将此节点和其子节点缓存为位图，节约drawcall
   * 需要注意的是，这里会增大内存，这里尽量对不容易变化的节点设置，否则得不偿失
   */
  set cacheAsBitmap(value)
  {

    if(value && typeof (this._customPostRender) != "BasePostEffect")
    {
      this.customPostRender = new BasePostEffect();
    }
    else
    {
      this.customPostRender = false;
    }
    this._cacheAsBitmap = value;
  }

  get cacheAsBitmap()
  {
    return this._cacheAsBitmap;
  }

  /**
   * 此渲染树的跟.不一定是stage
   * @returns {DisplayObject}
   */
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
    this.MarkasDirty();
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
    this.MarkasDirty();
  }

  get parent() {
    return this._parent;
  }

  get root() {
    return this._root;
  }

  set root(value)
  {
    this._root = value;
    this.MarkasDirty();
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
    this.isDirty = true;
  }

  CheckDirtyBitmap()
  {
    if(this.cacheAsBitmap && !this.isDirty)
    {
      return false;
    }
    return true;
  }

  /**
   * 添加subshader，用于合成一些特殊效果
   * @param subShaderObj
   * @param subShaderCallBack
   * @constructor
   */
  AddSubShader(subShaderObj,subShaderCallBack)
  {
    if(this._subShaders.indexOf(subShaderCallBack) != -1)
    {
      return;
    }

    this._subShaders[this._subShaders.length] = subShaderObj;
    this._subShaders[this._subShaders.length] = subShaderCallBack;
  }

  /**
   * 移除subshader，用于合成一些特殊效果
   * @param subShaderObj
   * @param subShaderCallBack
   * @constructor
   */
  RemoveShader(subShaderObj,subShaderCallBack)
  {

    if(this._subShaders.indexOf(subShaderCallBack) == -1)
    {
      return;
    }

    this._subShaders.splice( this._subShaders.indexOf( subShaderObj )-1, 2 );
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

    this._shader.UseProgram();

    this._shader.SetMatrixUniform(RenderSupport.mvpMatrix,"mvpMatrix");
  }

  PreRender(deltaTime)
  {
    this._vPreRender(deltaTime);
  }

  _vPreRender(deltaTime)
  {

  }

  Render(deltaTime)
  {

    this.PreRender(deltaTime);

    if (this.CheckDirtyBitmap())
    {
      this.RenderToTargetTexture();

      this._vFillBuffer();

      this._vFillUniform();

      Status.AddDrawCount();

      for (let i = 0; i < this._subShaders.length;i = i+2)
      {
        var arg = {"gl":this.gl};
        this._subShaders[i+1].call(this._subShaders[i],arg);
        Status.AddDrawCount();
      }
    }

    this.PostRender(deltaTime);
  }

  PostRender(deltaTime)
  {
    this._vPostRender(deltaTime);
    this.isDirty = false;
  }

  _vPostRender(deltaTime)
  {
    this.FinishRenderTargetTexture();
  }

  RenderToTargetTexture()
  {
    if(!this._needRenderTarget)
    {
      return;
    }

    let gl = this.gl;

    var bound = new Bound(this.localPosition.x,this.localPosition.y,this.width,this.height);

    //创建帧缓冲区对象
    var fbo = gl.createFramebuffer();
    //创建渲染缓冲区对象
    //var renderbuffer = gl.createRenderbuffer();
    //绑定帧缓冲区
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    //绑定渲染缓冲区
    //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    //初始化渲染缓冲区，这里只指定了模板缓冲区，没有指定深度缓冲区
    //如果需要深度缓冲区，第二参数可改为 DEPTH_STENCIL,同时 framebufferRenderbuffer 的第二个参数为 DEPTH_STENCIL_ATTACHMENT
    //gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, bound.width, bound.height);
    //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER,renderbuffer);

    //创建帧缓冲纹理
    var fboTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fboTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,GLSeetting.viewPortWidth , GLSeetting.viewPortHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    //附着帧缓冲区的颜色缓冲区
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTexture, 0);

    this._renderTexture.glFBOTexture = fboTexture;
    this._renderTexture.bounds = bound;

    if(!this.cacheAsBitmap)
    {
      RenderSupport.PushFBO(fbo);
    }
  }

  FinishRenderTargetTexture()
  {
    if(this._needRenderTarget)
    {
      if(!this.cacheAsBitmap)
      {
        RenderSupport.PopFBO();
      }

      if(RenderSupport.fbo)
      {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, RenderSupport.fbo);
      }else{
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      }
      this._customPostRender.RenderImage(this.parent,this._renderTexture);

      //不cache就清除
      if(!this.cacheAsBitmap)
      {
        this._renderTexture.glFBOTexture = false;
        this._renderTexture.bounds = false;
      }
    }
  }
 }
