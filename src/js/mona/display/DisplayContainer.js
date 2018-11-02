import {DisplayObject} from "./DisplayObject.js";
import {RenderSupport} from "../rendering/RenderSupport.js";


//有容器功能，下面都可以有子节点
export class DisplayContainer extends DisplayObject
{

  constructor(width,height)
  {
    super(width,height);
    this._children = new Array();

  }

  AddChild(child)
  {
    if((child instanceof  DisplayObject) == false)
    {
      console.log("DisplayObject AddChild error");
      return;
    }

    child._parent = this;
    child._root = this.root;
    this._children.push(child);
    child._vFillVertices();
    this.MarkasDirty();
  }

  RemoveChild(child)
  {
    if((child instanceof  DisplayObject) == false)
    {
      console.log("DisplayObject RemoveChild error");
      return;
    }

    this.MarkasDirty();
    child._parent = false;
    child._root = false;
    this._children.splice( this._children.indexOf( child ), 1 );
  }


  get Children()
  {
    return this._children;
  }

  Render(deltaTime)
  {
    this.RenderToTargetTexture();

    for ( let i = 0; i <this.Children.length; i++)
    {
      if(this.Children[i].renderReady)
      {
        RenderSupport.PushMatrix();
        RenderSupport.TransformMatrix(this.Children[i]);
        this.Children[i].Render(deltaTime);
        RenderSupport.PopMatrix();
      }
    }

    this.FinishRenderTargetTexture();
  }

  //事件从渲染树子节点向跟节点冒泡
  brocastEvent(eventType,eventData)
  {
    for ( let i = 0; i <this.Children.length; i++)
    {
      if(this.Children[i].renderReady)
      {
        this.Children[i].brocastEvent(eventType,eventData);
      }
    }

    super.brocastEvent(eventType,eventData);
  }

}
