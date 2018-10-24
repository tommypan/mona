export class GLSeetting {

  constructor(gl,width,height)
  {
    if(gl)
    {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    GLSeetting.viewPortWidth = width;
    GLSeetting.viewPortHeight = height;
    gl.viewport(0,0,width,height);
  }
}
GLSeetting.viewPortWidth = 0;
GLSeetting.viewPortHeight = 0;
