export class TextFormat{

  constructor(font,align,baseline,fillStyle)
  {
    this.font = font ? font : "40px Arial";
    this.textAlign = align ? align : "center";
    this.textBaseline = baseline ? baseline :"middle";
    this.fillStyle = fillStyle ? fillStyle : "black";
  }


}
