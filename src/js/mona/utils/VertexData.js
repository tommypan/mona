
export class VertexData
{
  constructor(isBatch)
  {
    if(isBatch)
    {
      this._vertices = new Float32Array([ //readyonly
        0.0,  0.0,   0.0, 1.0,
        0.0,  0.0,   0.0, 1.0,
        -0.0, -0.0,   0.0, 0.0,
        0.0,  0.0,   1.0, 1.0,
        0.0, -0.0,   1.0, 0.0,
        0.0, -0.0,   1.0, 0.0,
      ]);
    }
    else
    {
      this._vertices = new Float32Array([ //readyonly
        0.0,  0.0,   0.0, 1.0,
        -0.0, -0.0,   0.0, 0.0,
        0.0,  0.0,   1.0, 1.0,
        0.0, -0.0,   1.0, 0.0,
      ]);
    }

    this.VERTEXT_PER_ELEMENT_COUNT = 4;
  }

  get vertices()
  {
    return this._vertices;
  }


  get BYTES_PER_ELEMENT()
  {
    return this._vertices.BYTES_PER_ELEMENT;
  }

  get vertextNum()
  {
    return this._vertices.length / this.VERTEXT_PER_ELEMENT_COUNT;
  }

  ExpandVertextToBatch()
  {
    var oldVertext = this._vertices;
    this._vertices = new Float32Array(this._vertices.length + this.VERTEXT_PER_ELEMENT_COUNT * 2 );
    for(let i = 0; i < this._vertices.length;i++)
    {
      //拷贝第一个点
      if(i < this.VERTEXT_PER_ELEMENT_COUNT)
      {
        this._vertices[i] = oldVertext[i];
        continue;
      }

      //拷贝最后一个点
      if(i >= this.VERTEXT_PER_ELEMENT_COUNT * 5)
      {
        this._vertices[i] = oldVertext[i - this.VERTEXT_PER_ELEMENT_COUNT * 2];
        continue;
      }

      this._vertices[i] = oldVertext[i - this.VERTEXT_PER_ELEMENT_COUNT];
    }
  }
  //ID从0开始
  SetVertextPosition(vertextID,posX,posY)
  {
    let index = vertextID * this.VERTEXT_PER_ELEMENT_COUNT;
    this._vertices[index] = posX;
    this._vertices[index + 1] = posY;
  }

  //预留 ID从0开始
  SetVertextColor(vertextID,r,g,b,a)
  {

  }

  //ID从0开始
  SetTextureCoords(vertextID,u,v)
  {
    let index = vertextID * this.VERTEXT_PER_ELEMENT_COUNT + 2;
    this._vertices[index] = u;
    this._vertices[index + 1] = v;
  }

  AppendVertices(vertextData,childIndex,transformationMatrix)
  {
    if((vertextData instanceof  VertexData) == false)
    {
      console.log("VertexData AppendVertices error");
      return;
    }

    let perQuadVerticeLength = 24;
    if(this.vertices.length < (childIndex+1)*perQuadVerticeLength + perQuadVerticeLength)
    {
      let oldVertices = this.vertices;
      this._vertices = new Float32Array(oldVertices.length+perQuadVerticeLength);
      for (let i = 0; i < oldVertices.length;i++)
      {
        this._vertices[i] = oldVertices[i];
      }
    }


    let curVertextID = (childIndex+1) * vertextData.vertextNum;
    for (let i = 0; i < vertextData.vertextNum;i++)
    {
      let index = curVertextID * this.VERTEXT_PER_ELEMENT_COUNT;
      let sourceDataOffset = this.VERTEXT_PER_ELEMENT_COUNT * i;
      let x = vertextData.vertices[sourceDataOffset];
      let y = vertextData.vertices[++sourceDataOffset];
      this._vertices[index] = transformationMatrix[0] * x + transformationMatrix[3] * y + transformationMatrix[6];
      this._vertices[++index] = transformationMatrix[4] * y + transformationMatrix[1] * x + transformationMatrix[7];

      for(let j = 0; j < this.VERTEXT_PER_ELEMENT_COUNT-2;j++)
      {
        this._vertices[++index] = vertextData.vertices[++sourceDataOffset];
      }
      curVertextID ++;
    }
  }

}
