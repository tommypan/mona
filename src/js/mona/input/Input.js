export class Input {

  static Init(stage)
  {
    Input.stage = stage;
    Input.preventPropagation = false;

    addEventListener('click', Input.inputEventHandle);
    addEventListener('mousedown', Input.inputEventHandle);
    addEventListener('mouseup', Input.inputEventHandle);
    addEventListener('dblclick', Input.inputEventHandle);
    addEventListener('mousemove', Input.inputEventHandle);

    addEventListener("keydown",Input.inputEventHandle);
    addEventListener("keyup",Input.inputEventHandle);
  }

  static inputEventHandle(event)
  {
    Input.stage.brocastEvent(event.type,event);
    Input.preventPropagation = false;
  }

  //阻止当前事件冒泡
  static stopPropagation()
  {
    Input.preventPropagation = true;
  }
}

