export class MathUtility {

  //将mat3转化为shader可以用的mat4
  static convertToMat4(mat3)
  {
    var target = mat4.create();
    target[0] = mat3[0];
    target[1] = mat3[1];
    target[4] = mat3[3];
    target[5] = mat3[4];
    target[12] = mat3[6];
    target[13] = mat3[7];
    return target;
  }

  //角度转弧度
  static degToRad(deg)
  {
    return deg*(Math.PI/180);
  }
}
