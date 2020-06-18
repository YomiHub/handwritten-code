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

class EventEmitter{
  constructor(){
    this.events = this.events||{};
  }
  on(eventName,fn){
    if(this.events.hasOwnProperty(eventName)){
      if(typeof this.events[eventName] === 'function'){
        this.events[eventName] = [this.events[eventName],fn]
      }else{
        this.events[eventName] = [...this.events[eventName],fn]
      }
    }else{
      this.events[eventName] = fn;
    }
  }
  //只保存一个消息
  once(fn){
    this.events[eventName] = fn;
  }
  //发送消息
  emit(eventName,data){
    if(!this.events.hasOwnProperty(eventName)){
      return;
    }

    if(typeof this.events[eventName] === 'function'){
      this.events[eventName](data);
    }else{
      this.events[eventName].map(fn => {
        fn(data)
      });
    }
  }
  //移除消息
  off(eventName){
    if(!this.events.hasOwnProperty(eventName)){
      return;
    }
    delete this.events[eventName]
  }
}


const EventBus = new EventEmitter();
//window.EventBus = EventBus;//将EventBus对象放到window对象中

//测试

EventBus.on('first-event',function(data){
  console.log('消息内容：'+data)
})

EventBus.emit('first-event','Hello World'); //消息内容：Hello World

setTimeout(() => {
  EventBus.off('first-event')
}, 1000);