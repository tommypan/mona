import {Stage} from "./rendering/Stage.js";

export class mona {
  constructor(targetFPS){

    this.FPS = targetFPS ? targetFPS : 1000/30;

    this.stage = new Stage();
  }

  Init()
  {
    this._schedualID = setInterval(this.update.bind(this),this.FPS);
  }

  UnInit()
  {
    clearInterval(this._schedualID);
  }

  update()
  {
    this.updateDisplayTree();
  }

  updateDisplayTree()
  {

    this.stage.RenderDisplayTree();

  }
}
