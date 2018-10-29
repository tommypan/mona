import {EventDefine} from "../events/EventDefine.js";
import {Input} from "./Input.js";

//系统监听事件冒泡
export class InputEventListener {

  constructor()
  {
    this.listenerList = new Array();
  }

  //相对于世界坐标的包围盒
  getBound()
  {
      console.log("InputEventListener getBound need override");
  }

  brocastEvent(eventType,eventData)
  {
    if(Input.preventPropagation)
    {
      return;
    }

    if(!this.hasEvent(eventType))
    {
      return;
    }

    if(eventType == EventDefine.MOUSE_EVENT_CLICK
    || eventType == EventDefine.MOUSE_EVENT_DOUBLE_CLICK
    || eventType == EventDefine.MOUSE_EVENT_DOWN
    || eventType == EventDefine.MOUSE_EVENT_UP
    || eventType == EventDefine.MOUSE_EVENT_MOVE)
    {
      let bound = this.getBound();
      if(!bound)
      {
        return;
      }

      if(!bound.CheckInteractPoint(eventData.x,eventData.y))
      {
        return;
      }
    }

    this.listenerList[eventType][0].call(this.listenerList[eventType][1],eventData);
  }

  hasEvent(eventType)
  {
    return this.listenerList[eventType];
  }

  addEventListener(handlerObj,eventType,handlerFunc,priority)
  {
    if(this.hasEvent(eventType))
    {
      console.log("InputEventListener addEventListener error");
      return;
    }

    this.listenerList[eventType] = [];
    this.listenerList[eventType][0] = handlerFunc;
    this.listenerList[eventType][1] = handlerObj;
  }

  removeEventListener(eventType)
  {
    if(!this.hasEvent(eventType))
    {
      return;
    }

    delete this.listenerList[eventType];
  }

}
