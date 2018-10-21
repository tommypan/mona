export class GLSeetting {

  constructor(gl)
  {
    if(gl)
    {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }
}
