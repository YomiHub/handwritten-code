//?防抖：在事件发生后，事件处理器要等一定阈值的时间，在该时间内没有事件发生，就会执行最后一次发生的事件，反之，则需要重新等待指定时间。
function deboundce (fn, wait) {
  let timer = null;
  return function () {
    const context = this;
    //在规定时间内再次触发时清除定时器
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, arguments);
    }, wait)
  }
}


//案例：可以结合滚动事件实现滚动防抖
// function fn () {
//   console.log('我滚了');
// }
// window.addEventListener('scroll', deboundce(fn, 500))

//?节流：可以将一个函数的调用频率限制在一个阈值内，比如：在一秒内函数一定不会被调用两次
function throttle (fn, wait) {
  let prev = new Date();
  return function () {
    const args = arguments;
    const now = new Date();
    if (now - prev > wait) {
      fn.apply(this, args);
      prev = new Date();
    }
  }
}
