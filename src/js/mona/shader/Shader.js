import {webglUtils} from "../utils/webglUtils.js";

export class Shader {
  constructor(gl,vetextPath, fragmentPath,callBack,prepareContent) {
    this.gl = gl;
    this._shaderProgram = false;

    if(prepareContent)
    {
      this._shaderProgram = webglUtils.InitShader(gl,vetextPath,fragmentPath);
    }else
    {
      this.vetextPath = vetextPath;
      this.fragmentPath = fragmentPath;
      this.initShader(gl, vetextPath, fragmentPath, callBack);
    }

  }


  initShader(gl, vsFile, fsFile, callBack)
  {
    var vs = null;
    var fs = null;
    var that = this;
    var onShaderLoaded = function () {
      if (vs && fs)
      {
        that._shaderProgram = webglUtils.InitShader(gl,vs,fs);
        callBack(that._shaderProgram);
      }
    }

    this.loadShaderFromFile(vsFile,function (vsContent) {
      vs = vsContent;
      onShaderLoaded();
    })

    this.loadShaderFromFile(fsFile,function (fsContent) {
      fs = fsContent;
      onShaderLoaded();
    })
  }

  loadShaderFromFile(fileName,onLoadedFile)
  {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200)
      {
        onLoadedFile(request.responseText);
      }
    }

    request.open("GET",fileName,true);
    request.send();
  }

  initShader(gl, vsFile, fsFile, callBack)
  {
    var vs = null;
    var fs = null;
    var that = this;
    var onShaderLoaded = function () {
      if (vs && fs)
      {
        that._shaderProgram = webglUtils.InitShader(gl,vs,fs);
        callBack(that._shaderProgram);
      }
    }

    this.loadShaderFromFile(vsFile,function (vsContent) {
      vs = vsContent;
      onShaderLoaded();
    })

    this.loadShaderFromFile(fsFile,function (fsContent) {
      fs = fsContent;
      onShaderLoaded();
    })
  }

  loadShaderFromFile(fileName,onLoadedFile)
  {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200)
      {
        onLoadedFile(request.responseText);
      }
    }

    request.open("GET",fileName,true);
    request.send();
  }

  CreateBuffer(vertices)
  {
    let gl = this.gl;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  }


  SetAttribute(attributeName,fSize,offset)
  {

    let gl = this.gl;
    //获取坐标点
    var attribute = gl.getAttribLocation(this._shaderProgram, attributeName);
    //将缓冲区对象分配给a_Position变量
    // 告诉属性怎么从 positionBuffer (ARRAY_BUFFER) 中读取位置
    //var size = 3;          // 每次迭代使用 3 个单位的数据
    //var type = gl.FLOAT;   // 单位数据类型是32位的浮点型
    //var normalize = false; // 不需要归一化数据
    //var stride = 0;        // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
    //var offset = 0;        // 从绑定缓冲的起始处开始

    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, fSize*4, fSize*offset);//shader索引，元素个数，浮点型的常量,
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(attribute);
  }

  UseProgram()
  {
    this.gl.useProgram(this._shaderProgram);
  }

  SetTexture(texture,uniformName,textureIndex,notNeedFlip)
  {
    let gl = this.gl;

    if(!notNeedFlip)
    {
      //1.对纹理图像进行Y轴反转
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    }
    //2.开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //3.向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);


    var u_Sampler = gl.getUniformLocation(this._shaderProgram,uniformName);
    gl.uniform1i(u_Sampler, textureIndex);
  }

  SetMatrixUniform(matrix,matrixName)
  {
    let gl = this.gl;
    var mvpMatrix = gl.getUniformLocation(this._shaderProgram,matrixName);
    gl.uniformMatrix4fv(mvpMatrix, false, matrix);
  }

}
