import { DisplayContainer } from "../display/DisplayContainer.js";
import { GLSeetting } from  "./GLSeetting.js";
import {RenderSupport} from "./RenderSupport.js";
import {Status} from "../debug/Status.js";

//舞台，渲染树的跟节点
export class Stage extends  DisplayContainer{
  constructor(){
    var canvas = document.getElementById('canvas');
    super(canvas.width,canvas.height);
    this._root = this;
    this.FPS = 1000/30;

    new GLSeetting(this.gl,canvas.width,canvas.height);


    setInterval(this.update.bind(this),this.FPS);
    }

    update()
    {
      this.updateDisplayList();
    }

    updateDisplayList()
    {

      Status.ResetDrawCount();
      RenderSupport.ClearMatrix()
      if(this.isDirty)
      {
        this.Render();
        this.isDirty = false;
      }

    }
}
