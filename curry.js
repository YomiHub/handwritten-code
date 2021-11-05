//?柯里化函数：将多参数函数转为单参数的形式，特点：参数复用、提前返回和延迟执行
//柯里化函数实现的原理：利用闭包原理在执行可以形成一个不销毁的作用域，然后把需要预先处理的内容都储存在这个不销毁的作用域中，并且返回一个最少参数函数。
function curry (fn, args) {
  var length = fn.length;//函数的形参个数
  var args = args || [];
  return function () {
    var newArgs = args.concat(Array.prototype.slice.call(arguments));  //arguments非数组类型，所以调用call
    if (newArgs.length < length) {
      return curry.call(this, fn, newArgs);
    } else {
      return fn.apply(this, newArgs);
    }
  }
}

function getSum (a, b, c, d) {
  return a + b + c + d;
}

var sum = curry(getSum);

console.log(sum(1)(2)(3, 4));  //10
console.log(sum(1, 2, 3, 4));  //10


//?ES6一行代码实现函数柯里化  
const es6Curry = (fn, arr = []) => (...args) => (
  arg => args.length === fn.length
    ? fn(...arg)
    : es6Curry(fn, arg)
)([...arr, ...args]);

var es6Sum = es6Curry(getSum);
console.log(es6Sum(1, 2, 3)(4))