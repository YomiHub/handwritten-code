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
