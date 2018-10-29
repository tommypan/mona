
export class Status{

  static AddDrawCount()
  {
    Status.DrawCallCount ++;
  }

  static ResetDrawCount()
  {
    Status.DrawCallCount = 0;
  }
}

Status.DrawCallCount = 0;
Status.fps = 0;

var drawcall = document.getElementById("drawcall");
var fps = document.getElementById("fps");
function drawStatus() {
  fps.innerText = "fps:"+Math.ceil(Status.fps).toString();
  drawcall.innerText = "drawcall:"+Status.DrawCallCount.toString();
  requestAnimationFrame(drawStatus);
}

requestAnimationFrame(drawStatus);
