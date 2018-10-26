import {GLSeetting} from "./GLSeetting.js";
import {MathUtility} from "../utils/MathUtility.js";
import {DisplayObject} from "../display/DisplayObject.js";

export class RenderSupport {
  constructor() {
  }

  static PushMatrix()
  {
    RenderSupport.stackIndex++;
    RenderSupport.modelViewMatrix = mat3.clone(RenderSupport.modelViewMatrix);
    RenderSupport.modelViewMatrixStack[RenderSupport.stackIndex] = RenderSupport.modelViewMatrix;
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
    if(RenderSupport.stackIndex <= 0)
    {
        console.log("PopMatrix Index Error");
        return;
    }

    RenderSupport.stackIndex--;
    RenderSupport.modelViewMatrix = RenderSupport.modelViewMatrixStack[RenderSupport.stackIndex];
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

}
RenderSupport.modelViewMatrix = mat3.create();
RenderSupport.stackIndex = 0;//因为会涉及到频繁的push，pop。每次如果重建数组比较耗时，所以用index避免重建
RenderSupport.modelViewMatrixStack = [RenderSupport.modelViewMatrix];
