
export class Asset {
  constructor(content,assetType,lifeType)
  {
    this.content = content;
    this.assetType = assetType;
    this.lifeType = lifeType;
  }
}



export class ResourceService {

  constructor()
  {

  }

  static Init()
  {
    ResourceService.AssetDic = new Array();
  }


  static AddAsset(key,content,assetType,lifeType)
  {
    var asset = new Asset(content,assetType,lifeType);
    if(!ResourceService.AssetDic[key])
    {
      ResourceService.AssetDic[key] = [];
    }

    let assetArray = ResourceService.AssetDic[key];
    assetArray[assetArray.length] = asset;
  }


  static GetAssets(key)
  {
    if(!ResourceService.AssetDic[key])
    {
      console.log("ResourceService GetAsset Error");
      return;
    }

    return ResourceService.AssetDic[key];
  }


}
ResourceService.Init();

