import {Stage} from "./rendering/Stage.js";
import {Input} from "./input/Input.js";
import {Status} from "./debug/Status.js";

export class mona {
  constructor(targetFPS){

    this.FPS = targetFPS ? targetFPS : 1000/30;

    this.stage = new Stage();

    Input.Init(this.stage);

  }

  Init()
  {

    this._lastTime = new Date();
    this._schedualID = setInterval(this.update.bind(this),this.FPS);
  }

  UnInit()
  {
    clearInterval(this._schedualID);
  }

  update()
  {
    var currentTime = new Date();
    var deltaTime = currentTime - this._lastTime;
    this._lastTime = currentTime;
    Status.fps = 1000/deltaTime;

    this.updateDisplayTree(deltaTime);
  }

  updateDisplayTree(deltaTime)
  {

    this.stage.RenderDisplayTree(deltaTime);

  }
}
