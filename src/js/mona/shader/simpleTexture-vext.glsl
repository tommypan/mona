attribute vec4 a_Position;
uniform mat4 u_xformMatarix;
attribute vec2 a_TextCoord;
varying vec2 v_TexCoord;

void main() {
  //设置坐标
  gl_Position = u_xformMatarix * a_Position;
   //设置纹素
  v_TexCoord = a_TextCoord;
}
