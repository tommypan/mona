import {Event} from "../events/Event.js";
import {EventDefine} from "../events/EventDefine.js";

//list这些由外部自己管理实现，render引擎不关心
export class Loader{

  constructor()
  {
  }

   LoadImage2D(path)
  {

    if(!path)
    {
      console.log("LoadImage2D need path")
      return;
    }


    var image = new Image();
    //加载纹理
    image.onload = function(){
      //todo 这里可以考虑用event实现，不用函数回调，这样比较方便外部移除监听
      Event.Dispatch(EventDefine.EVENT_LOAD_IMAGE2D_COMPLETE,image);
    };

    // 2次幂必须保证，不需要解释撒
    image.src = path;
  }
}
