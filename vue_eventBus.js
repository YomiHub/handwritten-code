//?EventBus能够简化各组件间的通信，让我们的代码书写变得简单，能有效的分离事件发送方和接收方(也就是解耦的意思)，能避免复杂和容易出错的依赖性和生命周期问题
//极简版
/* class EventEmitter{
  constructor(){
    //存储事件
    this.events = this.events||new Map();
  }
  //监听事件
  addListener(type,fn){
    if(!this.events.get(type)){
      this.events.set(type,fn)
    }
  }
  //触发事件
  emit(type){
    let handle = this.events.get(type);
    handle.apply(this,[...arguments].slice(1))
  }
} 

// 测试
let emitter = new EventEmitter();

emitter.addListener('getInfo',(name,age)=>{
  console.log(name+'-'+age)
})

emitter.emit('getInfo','hym',18);  // hym-18

*/

class EventEmitter {
  constructor() {
    this.events = this.events || {};
  }
  on(eventName, fn) {
    if (this.events.hasOwnProperty(eventName)) {
      if (typeof this.events[eventName] === "function") {
        this.events[eventName] = [this.events[eventName], fn];
      } else {
        this.events[eventName] = [...this.events[eventName], fn];
      }
    } else {
      this.events[eventName] = fn;
    }
  }
  //只保存一个消息
  once(eventName, fn) {
    this.events[eventName] = fn;
  }
  //发送消息
  emit(eventName, data) {
    if (!this.events.hasOwnProperty(eventName)) {
      return;
    }

    if (typeof this.events[eventName] === "function") {
      this.events[eventName](data);
    } else {
      this.events[eventName].map((fn) => {
        fn(data);
      });
    }
  }
  //移除消息
  off(eventName) {
    if (!this.events.hasOwnProperty(eventName)) {
      return;
    }
    delete this.events[eventName];
  }
}

const EventBus = new EventEmitter();
//window.EventBus = EventBus;//将EventBus对象放到window对象中

//测试

EventBus.on("first-event", function (data) {
  console.log("消息内容：" + data);
});

EventBus.emit("first-event", "Hello World"); //消息内容：Hello World

setTimeout(() => {
  EventBus.off("first-event");
}, 1000);

// 2021-10-16更新
//实现发布订阅 比如vue中的EventBus、$on、$emit、$once
class EventEmitter {
  constructor() {
    this.events = [];
  }

  //事件监听
  on(evt, callback) {
    if (!this.events[evt]) {
      //避免监听被覆盖
      this.events[evt] = [];
    }

    this.events[evt].push(callback);
    return this;
  }

  //发布事件
  emit(evt, ...payload) {
    // console.log(payload)
    var callbacks = this.events[evt];

    if (callbacks) {
      callbacks.forEach((cb) => {
        cb.apply(this, payload);
      });
    }

    return this;
  }

  //删除订阅
  off(evt, callback) {
    if (typeof evt == "undefined") {
      this.events = {};
    } else if (typeof evt == "string") {
      if (typeof callback == "function") {
        this.events[evt] = this.events[evt].filter((cb) => cb != callback);
      } else {
        delete this.events[evt];
      }
    }
    return this;
  }

  once(evt, callback) {
    const proxyCallback = (...payload) => {
      callback.apply(this, payload);
      this.off(evt, proxyCallback);
    };

    this.on(evt, proxyCallback);
  }
}

const el = new EventEmitter();

const callback1 = (body) => {
  console.log("Hi," + body + ",i am callback1");
};
const callback2 = (body) => {
  console.log("Hi," + body + ",i am callback2");
};
const callback3 = (body) => {
  console.log("Hi," + body + ",i am callback3");
};

el.on("evt1", callback1);
el.on("evt1", callback2);
el.once("evt1", callback3);

el.emit("evt1", "girl");

el.off("evt1", callback2);
el.emit("evt1", "boy");


// 发布订阅模式

// 被观察者
class Subject {
  constructor() {
    this.observerList = []
  }

  addObserver(observer) {
    this.observerList.push(observer)
  }

  removeObserver(observer) {
    let index = this.observerList.findIndex((obj) => obj.name === observer.name)
    this.observerList.splice(index, 1)
  }

  notifyObservers(mes) {
    this.observerList.forEach((observer) => observer.notifyed(mes))
  }
}

//观察者
class Observer {
  constructor(name, subJect) {
    this.name = name
    if (subJect) {
      subJect.addObserver(this)
    }
  }

  notifyed(mes) {
    console.log(this.name, mes)
  }
}

const subject = new Subject()
const observerA = new Observer("observerA", subject)
const observerB = new Observer("observerB")
subject.addObserver(observerB)
subject.notifyObservers("Hello from subject")
subject.removeObserver(observerA)
subject.notifyObservers("Hello again")