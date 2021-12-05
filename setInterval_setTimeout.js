// setTimeout模拟setInterval
const simulateSetInterval = (func,time)=>{
  let timer = null;

  const interval = ()=>{
    timer = setTimeout(()=>{
      func();
      interval();
    },time)
  }

  interval();
  return ()=> clearTimeout(timer)
}

const cancel = simulateSetInterval(function(){
  console.log(1)  //打印3个1
},300);


setTimeout(()=>{
  cancel(); //关闭定时器
},1000)

//------------------------------------------------

// setInterval 模拟 setTimeout
const simulateSetTimeout = (fn, timeout) => {
  let timer = null

  timer = setInterval(() => {
    // 关闭定时器，保证只执行一次fn，也就达到了setTimeout的效果了
    clearInterval(timer)
    fn()
  }, timeout)
  // 返回用于关闭定时器的方法
  return () => clearInterval(timer)
}

simulateSetTimeout(() => {
  console.log(1)
}, 1000)

// 一秒后打印出1

// 来源链接：https://juejin.cn/post/7018337760687685669



//----------------------------------------------------
// 【头条】写一个 mySetInterVal(fn, a, b),每次间隔 a,a+b,a+2b,...,a+nb 的时间进行打印
function mySetInterVal(fn,a,b){
  this.a = a;
  this.b = b;
  this.time = 0;
  this.timer = null;

  this.start = ()=>{
    this.timer = setTimeout(()=>{
      fn();
      this.time++;
      this.start();
      console.log(this.a+this.time*this.b)
    },this.a+this.time*this.b)
  }

  this.stop = ()=>{
    clearTimeout(this.timer);
    this.timer = null;
  }
}

var test = new mySetInterVal(()=>{console.log("执行")},1000,1000);
test.start();

setTimeout(()=>{
  test.stop();
},3000)

//执行
//2000



