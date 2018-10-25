precision mediump float; //需要声明浮点数精度，否则报错No precision specified for (float)
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;  // 接受纹理坐标
void main() {
  //设置颜色
  gl_FragColor = texture2D(u_Sampler, v_TexCoord);  // 设置颜色
}
