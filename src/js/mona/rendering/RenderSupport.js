import {GLSeetting} from "./GLSeetting.js";
import {MathUtility} from "../utils/MathUtility.js";
import {DisplayObject} from "../display/DisplayObject.js";

export class RenderSupport {
  constructor() {
  }

  static Init()
  {
    RenderSupport.modelViewMatrix = mat3.create();
    RenderSupport.mvStackIndex = 0;//因为会涉及到频繁的push，pop。每次如果重建数组比较耗时，所以用index避免重建
    RenderSupport.modelViewMatrixStack = [RenderSupport.modelViewMatrix];

    RenderSupport.fboStack = [false];
    RenderSupport.fboStackIndex = 0;
    RenderSupport.fbo = false;
  }

  static PushMatrix()
  {
    RenderSupport.mvStackIndex++;
    RenderSupport.modelViewMatrix = mat3.clone(RenderSupport.modelViewMatrix);
    RenderSupport.modelViewMatrixStack[RenderSupport.mvStackIndex] = RenderSupport.modelViewMatrix;
  }

  //计算当前节点的modelview变换矩阵
  static TransformMatrix(child)
  {
    if((child instanceof  DisplayObject) == false)
    {
      console.log("TransformMatrix child error");
      return;
    }

    mat3.multiply(RenderSupport.modelViewMatrix,RenderSupport.modelViewMatrix,child.TransformMatrix);
  }

  static PopMatrix()
  {
    if(RenderSupport.mvStackIndex <= 0)
    {
        console.log("PopMatrix Index Error");
        return;
    }

    RenderSupport.mvStackIndex--;
    RenderSupport.modelViewMatrix = RenderSupport.modelViewMatrixStack[RenderSupport.mvStackIndex];
  }

  static ClearMatrix()
  {
    RenderSupport.modelViewMatrix = [];
    mat3.identity(RenderSupport.modelViewMatrix);
  }

  static get mvpMatrix()
  {
    var projectionMatrix = mat3.create();
    mat3.projection(projectionMatrix,GLSeetting.viewPortWidth,GLSeetting.viewPortHeight);
    var finalMatrix = mat3.create();
    mat3.multiply(finalMatrix,projectionMatrix,RenderSupport.modelViewMatrix);

    return MathUtility.convertToMat4(finalMatrix);
  }

  static PushFBO(fbo)
  {
    RenderSupport.fboStackIndex ++;
    RenderSupport.fboStack[RenderSupport.fboStackIndex] = fbo;
    RenderSupport.fbo = RenderSupport.fboStack[RenderSupport.fboStackIndex];
  }

  static PopFBO()
  {
    if(RenderSupport.fboStackIndex <= 0)
    {
      console.log("PopFBO Index Error");
      return;
    }

    RenderSupport.fboStackIndex--;

    RenderSupport.fbo = RenderSupport.fboStack[RenderSupport.fboStackIndex]
  }

}
