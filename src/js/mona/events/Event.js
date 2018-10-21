export class Event {

  constructor()
  {

  }

  static AddEvent(obj,eventID,callBack)
  {
      if(!Event._events[eventID])
      {
        Event._events[eventID] = [];
      }

      //拒绝一样的监听
    let eventArr = Event._events[eventID];
    for (let i = 0; i < eventArr.length;i++)
    {
      if(eventArr[i][0] == obj && eventArr[i][1] == callBack)
      {
       return;
      }
    }

    eventArr.push([obj, callBack]);

  }

  static RemoeEvent(obj,eventID)
  {
    if(!Event._events[eventID])
    {
      return;
    }

    let eventArr = Event._events[eventID];
    for (let i = 0; i < eventArr.length;i++)
    {
      if(eventArr[i][0] == obj)
      {
        eventArr.splice(i, 1);
        i--;
      }
    }
  }

  static Dispatch(eventID,arg)
  {
    if(!Event._events[eventID])
    {
      return;
    }

    let eventArr = Event._events[eventID];
    for (let i = 0; i < eventArr.length;i++)
    {
      eventArr[i][1].call(eventArr[i][0],arg);
    }
  }
}
Event._events = {};
