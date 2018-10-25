import {webglUtils} from "../utils/webglUtils.js";

export class Shader {
  constructor(gl,vetextPath, fragmentPath,callBack) {
    this.vetextPath = vetextPath;
    this.fragmentPath = fragmentPath;
    this.initShader(gl, vetextPath, fragmentPath, callBack);
  }

  initShader(gl, vsFile, fsFile, callBack)
  {
    var vs = null;
    var fs = null;
    var onShaderLoaded = function () {
      if (vs && fs)
      {
        var shaderProgram = webglUtils.InitShader(gl,vs,fs);
        callBack(shaderProgram);
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
}
