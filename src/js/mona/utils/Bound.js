import {Vector2} from "./Vector2.js";

export class Bound {
  //x,y是左上角
  constructor(x,y,width,height)
  {
    this.x= x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  CheckInteractPoint(x,y)
  {
    return this.x <= x && (this.width+this.x) >= x && this.y <= y && (this.height+this.y) >= y;
  }

  CheckInteractBound(bound)
  {
      let aCenter = this.GetCenterPoint();
      let bCenter = bound.GetCenterPoint();

    if(Math.abs(aCenter.x - bCenter.x) < this.width/2 + bound.width/2 //横向判断
     && Math.abs(aCenter.y - bCenter.y) < this.height/2 + bound.height/2) //纵向判断
    {
      return true;
    }

    return false;
  }

  GetCenterPoint()
  {
    return new Vector2(this.x+this.width/2,this.y+this.height/2);
  }
}
