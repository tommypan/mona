export class Bound {
  constructor(x,y,width,height)
  {
    this.x= x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  CheckInteract(x,y)
  {
    return this.x <= x && (this.width+this.x) >= x && this.y <= y && (this.height+this.y) >= y;
  }
}
