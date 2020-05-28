//?EventBus能够简化各组件间的通信，让我们的代码书写变得简单，能有效的分离事件发送方和接收方(也就是解耦的意思)，能避免复杂和容易出错的依赖性和生命周期问题
class EventEmitter{
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
