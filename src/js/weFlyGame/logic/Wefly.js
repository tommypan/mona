import {LoaderService} from "../framework/LoaderService.js";
import {Sprite} from "../../mona/display/Sprite.js";
import {GameEventDefine} from "./GameEventDefine.js";
import {Event} from "../../mona/events/Event.js";
import {ResourceService} from "../framework/ResourceService.js";
import {mona} from "../../mona/mona.js";
import {MovieClip} from "../../mona/animation/MovieClip.js";
import {Vector2} from "../../mona/utils/Vector2.js";
import {EventDefine} from "../../mona/events/EventDefine.js";
import {BatchSprite} from "../../mona/display/BatchSprite.js";
import {Text} from "../../mona/text/Text.js";
import {BasePostEffect} from "../../mona/postEffect/BasePostEffect.js";
import {DisplayContainer} from "../../mona/display/DisplayContainer.js";
import {Shader} from "../../mona/shader/Shader.js";

class Enemy
{
  constructor(type,display,parent,stage)
  {
    this.hp = type;
    this.type = type;
    this.display = display;
    this.parent = parent;
    this.stage = stage;
  }

  playDead()
  {
    this.parent.RemoveSprite(this.display);
    this.deadMovie = false;
    if(this.type == 1)
    {
      this.deadMovie = new MovieClip(ResourceService.GetAssets("enemy1_down"));
    }else if(this.type == 2)
    {
      this.deadMovie = new MovieClip(ResourceService.GetAssets("enemy2_down"));
    }else if(this.type ==3)
    {
      this.deadMovie = new MovieClip(ResourceService.GetAssets("enemy3_down"));
    }

    this.stage.AddChild(this.deadMovie);

    this.deadMovie.localPosition = this.display.localPosition;
    this.deadMovie.playSpeed = 100;
    this.deadMovie.Play();

    setTimeout(this.removeDead.bind(this),300)
  }

  removeDead()
  {
    this.stage.RemoveChild(this.deadMovie);
  }

  remove()
  {
    this.parent.RemoveSprite(this.display);
  }
}


export class Wefly
{
  constructor()
  {
    let engine = new mona();
    engine.Init();
    this.stage = engine.stage;
    let shader1 = {"vsFile":"js/mona/shader/simpleTexture-vext.glsl","fsFile" :"js/mona/shader/simpleTexture-frag.glsl"};
    let shader2 = {"vsFile":"js/mona/shader/text-vext.glsl","fsFile" :"js/mona/shader/text-frag.glsl"};
    Shader.WarmupAllShaders([shader1,shader2],this.loadResource,this);
  }

  loadResource()
  {
    LoaderService.AddLoad("bullet1","img/shoot/bullet1.png");

    LoaderService.AddLoad("enemy1","img/shoot/enemy1.png");
    LoaderService.AddLoad("enemy1_down","img/shoot/enemy1_down1.png");
    LoaderService.AddLoad("enemy1_down","img/shoot/enemy1_down2.png");
    LoaderService.AddLoad("enemy1_down","img/shoot/enemy1_down3.png");
    LoaderService.AddLoad("enemy1_down","img/shoot/enemy1_down4.png");

    LoaderService.AddLoad("enemy2","img/shoot/enemy2.png");
    LoaderService.AddLoad("enemy2_down","img/shoot/enemy2_down1.png");
    LoaderService.AddLoad("enemy2_down","img/shoot/enemy2_down2.png");
    LoaderService.AddLoad("enemy2_down","img/shoot/enemy2_down3.png");
    LoaderService.AddLoad("enemy2_down","img/shoot/enemy2_down4.png");

    LoaderService.AddLoad("enemy3","img/shoot/enemy3.png");
    LoaderService.AddLoad("enemy3_down","img/shoot/enemy3_down1.png");
    LoaderService.AddLoad("enemy3_down","img/shoot/enemy3_down2.png");
    LoaderService.AddLoad("enemy3_down","img/shoot/enemy3_down3.png");
    LoaderService.AddLoad("enemy3_down","img/shoot/enemy3_down4.png");


    LoaderService.AddLoad("game_pause","img/shoot/game_pause_nor.png");
    LoaderService.AddLoad("game_resume","img/shoot/game_resume_nor.png");

    LoaderService.AddLoad("hero","img/shoot/hero1.png");
    LoaderService.AddLoad("hero","img/shoot/hero2.png");

    LoaderService.AddLoad("hero_down","img/shoot/hero_blowup_n1.png");
    LoaderService.AddLoad("hero_down","img/shoot/hero_blowup_n2.png");
    LoaderService.AddLoad("hero_down","img/shoot/hero_blowup_n3.png");
    LoaderService.AddLoad("hero_down","img/shoot/hero_blowup_n4.png");



    LoaderService.AddLoad("background","img/shoot_background/background.png");
    LoaderService.AddLoad("btn_finish","img/shoot_background/btn_finish.png");
    LoaderService.AddLoad("game_loading","img/shoot_background/game_loading1.png");
    LoaderService.AddLoad("game_loading","img/shoot_background/game_loading2.png");
    LoaderService.AddLoad("game_loading","img/shoot_background/game_loading3.png");
    LoaderService.AddLoad("game_loading","img/shoot_background/game_loading4.png");
    LoaderService.AddLoad("gameover","img/shoot_background/gameover.png");
    LoaderService.AddLoad("shoot_copyright","img/shoot_background/shoot_copyright.png");

    LoaderService.Load();
    Event.AddEvent(this,GameEventDefine.EVENT_LOAD_COMPLETE,this.loadcomplete);
  }

  loadcomplete()
  {
    this.gotoInitScene();
  }

  gotoInitScene()
  {
    this.background = new Sprite(ResourceService.GetAssets("background")[0].content);
    this.stage.AddChild(this.background);

    this.game_loading = new MovieClip(ResourceService.GetAssets("game_loading"));
    this.stage.AddChild(this.game_loading);
    this.game_loading.localPosition = new Vector2(100,400);
    this.game_loading.playSpeed = 300;
    this.game_loading.Play();

    this.shoot_copyright = new Sprite(ResourceService.GetAssets("shoot_copyright")[0].content);
    this.stage.AddChild(this.shoot_copyright);
    this.shoot_copyright.localPosition = new Vector2(0,50);

    this._bulletCounting = 0;
    this._enemyCounting = 0;
    this._score = 0;
    this._gamePause = false;


    setTimeout(this.gotoBattleScene.bind(this),3000);
  }

  gotoBattleScene()
  {
    this.stage.RemoveChild(this.game_loading);
    this.stage.RemoveChild(this.shoot_copyright);

    this.hero = new MovieClip(ResourceService.GetAssets("hero"));
    this.stage.AddChild(this.hero);
    this.hero.localPosition = new Vector2(100,400);
    this.hero.Play();

    this.hero.addEventListener(this,EventDefine.MOUSE_EVENT_DOWN,this.startFocusHero);
    this.stage.customPostRender = new BasePostEffect();

    if(!this.bullets)
    {
      this.bullets = [];
      this.batchBulletContainer = new BatchSprite(ResourceService.GetAssets("bullet1")[0].content);
      this.stage.AddChild(this.batchBulletContainer);
    }

    if(!this.enemys)
    {
      this.enemys = [];
      this.batchEnemy1Container = new BatchSprite(ResourceService.GetAssets("enemy1")[0].content);
      this.stage.AddChild(this.batchEnemy1Container);

      this.batchEnemy2Container = new BatchSprite(ResourceService.GetAssets("enemy2")[0].content);
      this.stage.AddChild(this.batchEnemy2Container);

      this.batchEnemy3Container = new BatchSprite(ResourceService.GetAssets("enemy3")[0].content);
      this.stage.AddChild(this.batchEnemy3Container);
    }

    this.menuContainer = new DisplayContainer();
    var game_pause = new Sprite(ResourceService.GetAssets("game_pause")[0].content);
    game_pause.localPosition = new Vector2(320,10);
    game_pause.addEventListener(this,EventDefine.MOUSE_EVENT_CLICK,this.onGamePause);
    game_pause.AddSubShader(this,this.OnGamePauseSubShader);
    this.menuContainer.AddChild(game_pause);
    var game_resume = new Sprite(ResourceService.GetAssets("game_resume")[0].content);
    game_resume.localPosition = new Vector2(400,10);
    game_resume.addEventListener(this,EventDefine.MOUSE_EVENT_CLICK,this.onGameResume);
    this.menuContainer.AddChild(game_resume);


    this.stage.AddChild(this.menuContainer);
    this.menuContainer.cacheAsBitmap = true;

    this.updateID = setInterval(this.updateLogic.bind(this),30);
  }

  startFocusHero(eventData)
  {
    this.focusHero(eventData);
    this.hero.addEventListener(this,EventDefine.MOUSE_EVENT_MOVE,this.heroMove);
    this.stage.addEventListener(this,EventDefine.MOUSE_EVENT_UP,this.loseFocusHero);
  }

  loseFocusHero(eventData)
  {
    this.hero.removeEventListener(EventDefine.MOUSE_EVENT_MOVE);
    this.stage.removeEventListener(EventDefine.MOUSE_EVENT_UP);
  }

  focusHero(eventData)
  {
    var point = this.hero.parent.GlobalToLocal(new Vector2(eventData.x,eventData.y));
    this.hero.localPosition = new Vector2(point.x-this.hero.width/2,point.y-this.hero.height/2);
  }

  onGamePause(eventData)
  {
    this._gamePause = !this._gamePause;

    if(this._gamePause)
    {
      clearInterval(this.updateID);
    }else{
      this.updateID = setInterval(this.updateLogic.bind(this),30);
    }
  }

  onGameResume(eventData)
  {
    this.dispose();
    this.gotoInitScene();
  }

  heroMove(eventData)
  {
    this.focusHero(eventData);
  }

  OnGamePauseSubShader(arg)
  {
    console.log("OnGamePauseSubShader");
  }

  updateLogic()
  {
    this.dynamicCreateBullets();
    this.dynamicCreateEnemys();
    this.bulletsFly();
    this.enemysFly();
    this.checkBulletHit();
    this.checkDead();
  }

  dynamicCreateBullets()
  {

    this._bulletCounting ++;

    if(this._bulletCounting % 3 != 0)
    {
      return;
    }


    var bullet = new Sprite(ResourceService.GetAssets("bullet1")[0].content);
    this.batchBulletContainer.AddSprite(bullet);
    var bornPoint = this.hero.LocalToGlobal(new Vector2(this.hero.width/2,0));
    bullet.localPosition = bullet.parent.GlobalToLocal(bornPoint);
    this.bullets[this.bullets.length] = bullet;
  }

  dynamicCreateEnemys()
  {
    this._enemyCounting ++;

    if(this._enemyCounting % 10 != 0)
    {
      return;
    }

    var fakeRandomPoint = Math.random();
    var easyEnemyPoint = 0.5;
    var normalEnemyPoint = 0.8;
    var hardEnemyPoint = 1;
    if(fakeRandomPoint > 0 && fakeRandomPoint <= easyEnemyPoint)
    {
      var enemy = new Sprite(ResourceService.GetAssets("enemy1")[0].content);
      this.batchEnemy1Container.AddSprite(enemy);
      enemy.localPosition = new Vector2(Math.random()*this.stage.width,0);

      var easyEnemy = new Enemy(1,enemy,this.batchEnemy1Container,this.stage);
      this.enemys[this.enemys.length] = easyEnemy;
    }else if(fakeRandomPoint > easyEnemyPoint && fakeRandomPoint <= normalEnemyPoint)
    {
      var enemy = new Sprite(ResourceService.GetAssets("enemy2")[0].content);
      this.batchEnemy2Container.AddSprite(enemy);
      enemy.localPosition = new Vector2(Math.random()*this.stage.width,0);

      var normalEnemy = new Enemy(2,enemy,this.batchEnemy2Container,this.stage);
      this.enemys[this.enemys.length] = normalEnemy;
    }else if(fakeRandomPoint > normalEnemyPoint && fakeRandomPoint <= hardEnemyPoint)
    {
      var enemy = new Sprite(ResourceService.GetAssets("enemy3")[0].content);
      this.batchEnemy3Container.AddSprite(enemy);
      enemy.localPosition = new Vector2(Math.random()*this.stage.width,0);

      var hardEnemy = new Enemy(3,enemy,this.batchEnemy3Container,this.stage);
      this.enemys[this.enemys.length] = hardEnemy;
    }
  }


  bulletsFly()
  {
    for (let i = 0; i<this.bullets.length;i++)
    {
      let curpositon = this.bullets[i].localPosition;
      this.bullets[i].localPosition = new Vector2(curpositon.x,curpositon.y-8);

      if(!this.bullets[i].hitTest(this.stage.getBound()))
      {
        this.batchBulletContainer.RemoveSprite(this.bullets[i]);
        this.bullets.splice(i,1);
        i--;
      }
    }

  }

  enemysFly()
  {
    for (let i = 0; i<this.enemys.length;i++)
    {
      let curpositon = this.enemys[i].display.localPosition;
      this.enemys[i].display.localPosition = new Vector2(curpositon.x,curpositon.y+2);

      if(!this.enemys[i].display.hitTest(this.stage.getBound()))
      {
        this.enemys[i].remove();
        this.enemys.splice(i,1);
        i--;
      }
    }

  }

  checkBulletHit()
  {
    for (let i = 0; i<this.bullets.length;i++)
    {
      var bullet = this.bullets[i];
      for (let j = 0; j<this.enemys.length;j++)
      {
        var enemy = this.enemys[j];
        if(bullet.hitTest(enemy.display.getBound()))
        {
          enemy.hp--;
          if(enemy.hp <= 0)
          {
            enemy.playDead();
            this.enemys.splice(j,1);
            j--;
          }
          this.bullets.splice(i, 1);
          this.batchBulletContainer.RemoveSprite(bullet);
          i--;
          this._score ++;
          break;
        }
      }
    }
  }

  checkDead()
  {
    var dead = false;
    for (let j = 0; j<this.enemys.length;j++)
    {
      var enemy = this.enemys[j];
      if(this.hero.hitTest(enemy.display.getBound()))
      {
        dead = true;
        break;
      }
    }

    if(dead)
    {
      this.gotoEvalateScene();
    }
  }

  gotoEvalateScene()
  {
    this.dispose();

    this.gameover = new Sprite(ResourceService.GetAssets("gameover")[0].content);
    this.stage.AddChild(this.gameover);

    this.scoreText = new Text(this._score.toString(),null,50,60);
    this.stage.AddChild(this.scoreText);
    this.scoreText.localPosition = new Vector2(200,360);
  }

  dispose()
  {
    for (let i = 0; i<this.bullets.length;i++)
    {
      this.batchBulletContainer.RemoveSprite(this.bullets[i]);
    }
    this.bullets = false;

    for (let i = 0; i<this.enemys.length;i++)
    {
      this.enemys[i].remove();
    }
    this.enemys = false;

    clearInterval(this.updateID);

    this.stage.RemoveChild(this.menuContainer);

    this.stage.RemoveChild(this.background);

    this.stage.RemoveChild(this.batchBulletContainer);
    this.stage.RemoveChild(this.batchEnemy1Container);
    this.stage.RemoveChild(this.batchEnemy2Container);
    this.stage.RemoveChild(this.batchEnemy3Container);
  }
}
