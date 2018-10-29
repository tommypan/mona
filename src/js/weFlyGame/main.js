import {Sprite} from "../mona/display/Sprite.js";
import {Vector2} from "../mona/utils/Vector2.js";
import {Text} from "../mona/text/Text.js";
import {BatchSprite} from "../mona/display/BatchSprite.js";
import {Event} from "../mona/events/Event.js";
import {mona} from "../mona/mona.js";
import {LoaderService} from "./framework/LoaderService.js";
import {GameEventDefine} from "./logic/GameEventDefine.js";
import {ResourceService} from "./framework/ResourceService.js";
import {MovieClip} from "../mona/animation/MovieClip.js";
import {EventDefine} from "../mona/events/EventDefine.js";
import {Input} from "../mona/input/Input.js";

var numbers = [4, 9, 16, 25].map(function(value)
  {
    var i = 1;
    return value * value}
)

var displayContainer = false;
var hero = false;
var sprite2 = false;
window.onload = function () {

  //var testNum = numbers[1];
  // var loader = new Loader();
  // Event.AddEvent(this,EventDefine.EVENT_LOAD_IMAGE2D_COMPLETE,complte);
  // loader.LoadImage2D("img/shoot/hero1.png");

  LoaderService.AddLoad("hero","img/shoot/hero1.png");
  LoaderService.AddLoad("hero","img/shoot/hero2.png");
  LoaderService.AddLoad("ufo","img/shoot/ufo1.png");
  LoaderService.Load();
  Event.AddEvent(this,GameEventDefine.EVENT_LOAD_COMPLETE,complte);
}

// Draw the scene.
function drawScene(now) {
  //stage.RemoveChild(sprite);
  displayContainer.localPosition = new Vector2(displayContainer.localPosition.x+1,displayContainer.localPosition.y);
  requestAnimationFrame(drawScene);
}

function complte() {
  var engine = new mona();
  engine.Init();
  var stage = engine.stage;

  var ufoBitmapData = ResourceService.GetAssets("ufo")[0].content;

  hero = new MovieClip(ResourceService.GetAssets("hero"),100,100);
  hero.localPosition = new Vector2(200,200);
  hero.Play();
  stage.AddChild(hero);

  var sprite = new Sprite(ufoBitmapData,200,200);
  sprite.localPosition = new Vector2(115,5);
  sprite2 = new Sprite(ufoBitmapData,200,200);
  sprite2.localPosition = new Vector2(150,0)
  var text = new Text("demo",false,100,100);
  var text2 = new Text("hello",false,100,100);
  text2.localPosition = new Vector2(50,0);
  stage.AddChild(sprite2);

  stage.AddChild(text);
  stage.AddChild(text2);

  var smallSprite = new Sprite(ufoBitmapData,200,200);
  smallSprite.localPosition = new Vector2(55,0);
  smallSprite.localScale = new Vector2(0.5,0.5);
  //smallSprite.localRotation = 45;
  displayContainer = new BatchSprite(ufoBitmapData,50,50);
  stage.AddChild(displayContainer);
  displayContainer.AddSprite(sprite);
  displayContainer.AddSprite(smallSprite);


  smallSprite.LocalToGlobal(new Vector2(110,0));
  smallSprite.GlobalToLocal(new Vector2(110,5));
  requestAnimationFrame(drawScene);

  stage.addEventListener(EventDefine.MOUSE_EVENT_DOWN,HandleDown);
  //stage.addEventListener(EventDefine.MOUSE_EVENT_DOWN,HandleUp);
}

function HandleDown(eventData) {
  let point = hero.parent.GlobalToLocal(new Vector2(eventData.x,eventData.y));
  point.x = point.x - 50;
  point.y = point.y - 50;
  hero.localPosition = point;

  if(hero.hitTest(sprite2.getBound()))
  {
    var i = 0;
    i++;
  }
}
