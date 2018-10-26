
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


//
// var statusText = document.createElement("canvas").getContext("2d");
// statusText.canvas.width = 100;
// statusText.canvas.height = 100
// statusText.font = "48px serif";
// statusText.textAlign = "center";
// statusText.textBaseline = "middle";
// // textCtx.fillStyle = this.textFormat.fillStyle;
//
//
// function drawStatus() {
//   statusText.clearRect(0, 0, 100, 100);
//   statusText.fillText("drawCallCount:"+Status.DrawCallCount,50,50);
//   requestAnimationFrame(drawStatus);
// }
//
// requestAnimationFrame(drawStatus);
