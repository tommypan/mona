import { DisplayContainer } from "../display/DisplayContainer.js";
import { GLSeetting } from  "./GLSeetting.js";

export class Stage extends  DisplayContainer{
  constructor(){
    var canvas = document.getElementById('canvas');
    super(canvas.width,canvas.height);
    this._root = this;

    new GLSeetting(this.gl);

    this.gl.viewport(0,0,canvas.width,canvas.height);
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

      if(this.isDirty)
      {
        for ( let i = 0; i <this.Children.length; i++){
          this.Children[i].Render();
          this.Children[i].isDirty = false;
        }

        this.isDirty = false;
      }


    }

    updateTransform()
    {

    }
}
