import { DisplayContainer } from "../display/DisplayContainer.js";
import { GLSeetting } from  "./GLSeetting.js";
import {RenderSupport} from "./RenderSupport.js";

export class Stage extends  DisplayContainer{
  constructor(){
    var canvas = document.getElementById('canvas');
    super(canvas.width,canvas.height);
    this._root = this;

    new GLSeetting(this.gl,canvas.width,canvas.height);


    setInterval(this.update.bind(this),200);

    }

    update()
    {
      //以后这里有一大堆update
      this.updateDisplayList();
      this.updateTransform();
    }

    updateDisplayList()
    {

      RenderSupport.ClearMatrix()
      if(this.isDirty)
      {
        this.Render();
        this.isDirty = false;
      }


    }

    updateTransform()
    {

    }
}
