import { Sprite } from "./display/Sprite.js";
import { Stage } from "./rendering/Stage.js";
import { Vector2} from "./utils/Vector2.js";
import {Text} from "./text/Text.js";
import {Loader} from "./loader/Loader.js";
import {Event} from "./events/Event.js";
import {EventDefine} from "./events/EventDefine.js";
import {DisplayContainer} from "./display/DisplayContainer.js";
import {BatchSprite} from "./display/BatchSprite.js";

var numbers = [4, 9, 16, 25].map(function(value)
{
  var i = 1;
  return value * value}
)


var displayContainer = false
var stage = false;
window.onload = function () {

  //var testNum = numbers[1];
  var loader = new Loader();
  Event.AddEvent(this,EventDefine.EVENT_LOAD_IMAGE2D_COMPLETE,complte);
  loader.LoadImage2D("img/drive.jpg");
}
// Draw the scene.
function drawScene(now) {
 //stage.RemoveChild(sprite);
  displayContainer.localPosition = new Vector2(displayContainer.localPosition.x+1,displayContainer.localPosition.y);
  requestAnimationFrame(drawScene);
}

function complte(image) {
  var sprite = new Sprite(image,200,200);
  sprite.localPosition = new Vector2(115,5);
  var sprite2 = new Sprite(image,200,200);
  sprite2.localPosition = new Vector2(150,0)
  var text = new Text("demo",false,100,100);
  var text2 = new Text("hello",false,100,100);
  text2.localPosition = new Vector2(50,0);
   stage = new Stage();
  stage.AddChild(sprite2);

  stage.AddChild(text);
  stage.AddChild(text2);

  var smallSprite = new Sprite(image,200,200);
  smallSprite.localPosition = new Vector2(55,0);
  smallSprite.localScale = new Vector2(0.5,0.5);
  //smallSprite.localRotation = 45;
  displayContainer = new BatchSprite(image,50,50);
  stage.AddChild(displayContainer);
  displayContainer.AddSprite(sprite);
  displayContainer.AddSprite(smallSprite);


  smallSprite.LocalToGlobal(new Vector2(110,0));
  smallSprite.GlobalToLocal(new Vector2(110,5));
  requestAnimationFrame(drawScene);
}
