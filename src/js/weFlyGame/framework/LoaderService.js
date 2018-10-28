import {Loader} from "../../mona/loader/Loader.js";
import {EventDefine} from "../../mona/events/EventDefine.js";
import {Event} from "../../mona/events/Event.js";
import {ResourceService} from "./ResourceService.js";
import {GameEventDefine} from "../logic/GameEventDefine.js";

class LoadStruct {
  constructor(key,path,assetType)
  {
    this.key = key;
    this.path = path;
    this.assetType = assetType;
  }
}

export class LoaderService {

  constructor()
  {

  }

  static Init()
  {
    LoaderService.loadList = new Array();
    LoaderService.loader = new Loader();
    Event.AddEvent(LoaderService,EventDefine.EVENT_LOAD_IMAGE2D_COMPLETE,LoaderService.Loaded);
  }

  static AddLoad(key,path,assetType)
  {

    let loadStru = new LoadStruct(key,path,assetType);
    LoaderService.loadList[LoaderService.loadList.length] = loadStru;
  }

  static Load()
  {
    if(LoaderService.loadList.length <= 0)
    {
      console.log("LoaderService Load Error");
      return;
    }


    LoaderService.loader.LoadImage2D(LoaderService.loadList[0].path,LoaderService.loadList[0].key);
  }

  static Loaded(loadedArg)
  {
    LoaderService.loadList.splice(0,1);
    ResourceService.AddAsset(loadedArg.customParam,loadedArg.image);
    if(LoaderService.loadList.length > 0)
    {
      LoaderService.Load();
    }
    else
    {
      Event.Dispatch(GameEventDefine.EVENT_LOAD_COMPLETE);
    }
  }

}
LoaderService.Init();
