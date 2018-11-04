//在所有渲染树流程完成之后，给用户一个后处理的机会，实现各种现代后处理效果
import {RenderSupport} from "../rendering/RenderSupport.js";
import {Status} from "../debug/Status.js";
import {Shader} from "../shader/Shader.js";

export class BasePostEffect {

  constructor()
  {
    var canvas = document.getElementById('canvas');
    //获取绘制二维上下文
    this.gl = canvas.getContext('webgl');
    if (!this.gl) {
      console.log("webgl init Failed");
      return;
    }
  }

  RenderImage(parentContainer,source)
  {
   Status.DrawCallCount ++;
   this.onRenderImage(parentContainer,source);
  }
  /**
   * 后处理
   * @param parentContainer 此fboTexture的父容器.方便自定义后处理拿到显示列表做高级效果
   * @param source 目标fbo纹理
   */
  onRenderImage(parentContainer,source)
  {
    let gl = this.gl;

    //var bound = source.bounds;

    //默认处理
    var VSHADER_SOURCE =
      "attribute vec4 a_Position;" +
      "attribute vec2 a_TextCoord;" + // 接受纹理坐标
      "varying vec2 v_TexCoord;" +    // 传递纹理坐标
      "void main() {" +
      //设置坐标
      "gl_Position = a_Position;" +//设置坐标
      //设置纹素
      "v_TexCoord = a_TextCoord; " +  // 设置纹理坐标
      "} ";
    //片元着色器
    var FSHADER_SOURCE =
      "precision mediump float;" +  //需要声明浮点数精度，否则报错No precision specified for (float)
      "uniform sampler2D u_Sampler;" + // 取样器
      "varying vec2 v_TexCoord;" +  // 接受纹理坐标
      "void main() {" +
      //设置颜色
      "gl_FragColor = texture2D(u_Sampler, v_TexCoord);" +  // 设置颜色
      "}";

    var shader = new Shader(gl,VSHADER_SOURCE,FSHADER_SOURCE,false,true);

    // var vertices = new Float32Array([
    //   bound.width/2,  0,   0.0, 1.0,
    //   0, bound.height,   0.0, 0.0,
    //   bound.width,  0,   1.0, 1.0,
    //   bound.width, bound.height,   1.0, 0.0
    // ]);

    var vertices = new Float32Array([
      -1,  1,   0.0, 1.0,
      -1, -1,   0.0, 0.0,
      1,  1,   1.0, 1.0,
      1, -1,   1.0, 0.0
    ]);

    var n = 4;//点的个数
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    shader.CreateBuffer(vertices);

    shader.SetAttribute("a_Position",FSIZE,0);

    shader.SetAttribute("a_TextCoord",FSIZE,2);

    shader.UseProgram();

    shader.SetTexture(source.glFBOTexture,"u_Sample",0,true);

    shader.Draw(n);
  }
}
