attribute vec4 a_Position;
uniform mat4 mvpMatrix;
attribute vec2 a_TextCoord;
varying vec2 v_TexCoord;

void main() {
  //设置坐标
  gl_Position = mvpMatrix * a_Position;
   //设置纹素
  v_TexCoord = a_TextCoord;
}
