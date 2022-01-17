//?实现Promise

//Promise的一般用法
/*
new Promise(
  //执行器 executor
  function (resolve, reject) {          // 一段耗时很长的异步操作

    resolve();     // 数据处理完成
    reject();       // 数据处理出错
  }
).then(function A () {       // 成功，下一步
  //success
}, function B () {                // 失败，做相应处理
  //f
});
*/

//!初级版的Promise
function myPromise(constructor) {
  let self = this;
  self.status = "pending"; //初始状态
  self.value = undefined; //成功时的状态 resolved
  self.reason = undefined; //失败时状态 rejected

  function resolve(value) {
    if (self.status === "pending") {
      self.value = value;
      self.status = "resolved";
    }
  }

  function reject(reason) {
    if (self.status === "pending") {
      self.reason = reason;
      self.status = "rejected";
    }
  }

  //捕获构造异常
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

//可链式调用的then
myPromise.prototype.then = function (onFullfilled, onRejected) {
  let self = this;
  switch (self.status) {
    case "resolved":
      onFullfilled(self.value);
      break;
    case "rejected":
      onRejected(self.reason);
      break;
  }
};

var p = new myPromise(function (resolve, reject) {
  resolve(1);
});

p.then(
  function (data) {
    //成功
    console.log(data); //1
  },
  function (reason) {
    //失败
  }
);

// 简单版本基于class进行改写
class Promise {
  constructor(executor) {
    //默认状态是等待状态
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    //存放成功的回调
    this.onResolvedCallbacks = [];
    //存放失败的回调
    this.onRejectedCallbacks = [];
    let resolve = (data) => {
      //this指的是实例
      if (this.status === "pending") {
        this.value = data;
        this.status = "fullfilled";
        this.onResolvedCallbacks.forEach((fn) => fn(data));
      }
    };
    let reject = (reason) => {
      if (this.status === "pending") {
        this.reason = reason;
        this.status = "rejected";
        this.onRejectedCallbacks.forEach((fn) => fn(reason));
      }
    };
    try {
      //执行时可能会发生异常
      executor(resolve, reject);
    } catch (e) {
      reject(e); //promise失败了
    }
  }

  //返回非promise，不可链式调用  
  then(onFulFilled, onRejected) {
    if (this.status === "fullfilled") {
      onFulFilled(this.value);
    }
    if (this.status === "rejected") {
      onRejected(this.reason);
    }
    // 当前既没有完成 也没有失败
    if (this.status === "pending") {
      // 存放成功的回调
      this.onResolvedCallbacks.push(() => {
        onFulFilled(this.value);
      });
      // 存放失败的回调
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  };
}


//!比较完整的Promise
const PENDING = "pending";
const FULLFILLED = "fullfilled";
const REJECTED = "rejected";
function myPromise(excutor) {
  let that = this;
  that.status = PENDING;
  that.value = undefined; //fullfilled状态返回的数据
  that.reason = undefined; //rejected 状态返回错误的原因
  that.onFullfilledCallbacks = []; //成功后执行的回调
  that.onRejectedCallbacks = []; //失败后执行的回调

  function resolve(value) {
    if (value instanceof myPromise) {
      //!避免无限循环
      return value.then(resolve, reject);
    }

    //定时器确保 onFulfilled 和 onRejected 方法异步执行，且在then调用事件循环后的新执行栈中执行
    setTimeout(() => {
      //执行状态不可逆，只能由pending状态到fullfilled，避免重复调用resolve、reject
      if (that.status === PENDING) {
        that.value = value;
        that.status = FULLFILLED;
        that.onFullfilledCallbacks.forEach((cb) => cb(that.value)); //!回调对应的onFullfilled函数
      }
    });
  }

  function reject(reason) {
    setTimeout(() => {
      if (that.status === PENDING) {
        that.reason = reason;
        that.status = REJECTED;
        that.onRejectedCallbacks.forEach((cb) => cb(that.reason)); //!回调对应onRejected函数
      }
    });
  }

  try {
    excutor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  let that = this;
  let newPromise;

  //!处理参数，以保证后续执行
  onFullfilled =
    typeof onFullfilled === "function" ? onFullfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };

  if (that.status === FULLFILLED) {
    return (newPromise = new myPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFullfilled(that.value);
          newPromise.resolve(x); // 新的promise resolve 上一个onFulfilled的返回值
        } catch (e) {
          reject(e); //捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
        }
      });
    }));
  }

  if (that.status === REJECTED) {
    return (newPromise = new myPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onRejected(that.reason);
          newPromise.reject(x);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }

  if (that.status === PENDING) {
    //异步执行时，将onFullfilled和onRejected放入到数组中；
    return (newPromise = new myPromise((resolve, reject) => {
      that.onFullfilledCallbacks.push((value) => {
        try {
          let x = onFullfilled(that.value);
          newPromise.resolve(x); // 新的promise resolve 上一个onFulfilled的返回值
        } catch (e) {
          reject(e);
        }
      });
      that.onRejectedCallbacks.push((reason) => {
        try {
          let x = onRejected(that.reason);
          ewPromise.reject(x);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
};

var testTag = false;
var p = new myPromise(function (resolve, reject) {
  if (testTag) {
    //执行成功
    resolve(1);
  } else {
    reject(0);
  }
});

p.then(
  function (data) {
    //成功
    console.log(data); //1
  },
  function (reason) {
    //失败
    console.log(reason); //0
  }
);

//完善的Promise A+ 
//可参考掘金：https://juejin.cn/post/6844903607968481287
//案例来自公号文章：https://mp.weixin.qq.com/s/Gk8G1R9lt0o3zh0jusWWEg

class myPromise {
  // 为了统一用static创建静态属性，用来管理状态
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
  constructor(func) { // 给类的构造方法constructor添加一个参数func
      this.PromiseState = myPromise.PENDING; // 指定Promise对象的状态属性 PromiseState，初始值为pending
      this.PromiseResult = null; // 指定Promise对象的结果 PromiseResult
      this.onFulfilledCallbacks = []; // 保存成功回调
      this.onRejectedCallbacks = []; // 保存失败回调
      try {
          /**
           * func()传入resolve和reject，
           * resolve()和reject()方法在外部调用，这里需要用bind修正一下this指向
           * new 对象实例时，自动执行func()
           */
          func(this.resolve.bind(this), this.reject.bind(this));
      } catch (error) {
          // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
          this.reject(error)
      }
  }

  resolve(result) { // result为成功态时接收的终值
      // 只能由pedning状态 => fulfilled状态 (避免调用多次resolve reject)
      if (this.PromiseState === myPromise.PENDING) {
          /**
           * 为什么resolve和reject要加setTimeout?
           * 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
           * 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
           * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。 
           */
          setTimeout(() => {
              this.PromiseState = myPromise.FULFILLED;
              this.PromiseResult = result;
              /**
               * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
               * 看看数组里面有没有then那边 保留 过来的 待执行函数，
               * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
               */
              this.onFulfilledCallbacks.forEach(callback => {
                  callback(result)
              })
          });
      }
  }

  reject(reason) { // reason为拒绝态时接收的终值
      // 只能由pedning状态 => rejected状态 (避免调用多次resolve reject)
      if (this.PromiseState === myPromise.PENDING) {
          setTimeout(() => {
              this.PromiseState = myPromise.REJECTED;
              this.PromiseResult = reason;
              this.onRejectedCallbacks.forEach(callback => {
                  callback(reason)
              })
          });
      }
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数] 
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数 
   * @returns {function} newPromsie  返回一个新的promise对象
   */
  then(onFulfilled, onRejected) {
      /**
       * 参数校验：Promise规定then方法里面的两个参数如果不是函数的话就要被忽略
       * 所谓“忽略”并不是什么都不干，
       * 对于onFulfilled来说“忽略”就是将value原封不动的返回，
       * 对于onRejected来说就是返回reason，
       *     onRejected因为是错误分支，我们返回reason应该throw一个Error
       */
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      onRejected = typeof onRejected === 'function' ? onRejected : reason => {
          throw reason;
      };

      // 2.2.7规范 then 方法必须返回一个 promise 对象
      let promise2 = new myPromise((resolve, reject) => {
          if (this.PromiseState === myPromise.FULFILLED) {
              /**
               * 为什么这里要加定时器setTimeout？
               * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
               * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
               * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
               * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
               */
              setTimeout(() => {
                  try {
                      // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
                      let x = onFulfilled(this.PromiseResult);
                      resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                      // 2.2.7.2 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                      reject(e); // 捕获前面onFulfilled中抛出的异常
                  }
              });
          } else if (this.PromiseState === myPromise.REJECTED) {
              setTimeout(() => {
                  try {
                      let x = onRejected(this.PromiseResult);
                      resolvePromise(promise2, x, resolve, reject);
                  } catch (e) {
                      reject(e)
                  }
              });
          } else if (this.PromiseState === myPromise.PENDING) {
              // pending 状态保存的 resolve() 和 reject() 回调也要符合 2.2.7.1 和 2.2.7.2 规范
              this.onFulfilledCallbacks.push(() => {
                  setTimeout(() => {
                      try {
                          let x = onFulfilled(this.PromiseResult);
                          resolvePromise(promise2, x, resolve, reject)
                      } catch (e) {
                          reject(e);
                      }
                  });
              });
              this.onRejectedCallbacks.push(() => {
                  setTimeout(() => {
                      try {
                          let x = onRejected(this.PromiseResult);
                          resolvePromise(promise2, x, resolve, reject);
                      } catch (e) {
                          reject(e);
                      }
                  });
              });
          }
      })

      return promise2
  }
}

/**
* 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
* @param  {promise} promise2 promise1.then方法返回的新的promise对象
* @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
* @param  {[type]} resolve   promise2的resolve方法
* @param  {[type]} reject    promise2的reject方法
*/
function resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (x === promise2) {
      return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 2.3.2规范 如果 x 为 Promise ，则使 promise2 接受 x 的状态
  if (x instanceof myPromise) {
      if (x.PromiseState === myPromise.PENDING) {
          /**
           * 2.3.2.1 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
           *         注意"直至 x 被执行或拒绝"这句话，
           *         这句话的意思是：x 被执行x，如果执行的时候拿到一个y，还要继续解析y
           */
          x.then(y => {
              resolvePromise(promise2, y, resolve, reject)
          }, reject);
      } else if (x.PromiseState === myPromise.FULFILLED) {
          // 2.3.2.2 如果 x 处于执行态，用相同的值执行 promise
          resolve(x.PromiseResult);
      } else if (x.PromiseState === myPromise.REJECTED) {
          // 2.3.2.3 如果 x 处于拒绝态，用相同的据因拒绝 promise
          reject(x.PromiseResult);
      }
  } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
      // 2.3.3 如果 x 为对象或函数
      try {
          // 2.3.3.1 把 x.then 赋值给 then
          var then = x.then;
      } catch (e) {
          // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
          return reject(e);
      }

      /**
       * 2.3.3.3 
       * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
       * 传递两个回调函数作为参数，
       * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
       */
      if (typeof then === 'function') {
          // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
          let called = false; // 避免多次调用
          try {
              then.call(
                  x,
                  // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                  y => {
                      if (called) return;
                      called = true;
                      resolvePromise(promise2, y, resolve, reject);
                  },
                  // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                  r => {
                      if (called) return;
                      called = true;
                      reject(r);
                  }
              )
          } catch (e) {
              /**
               * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
               * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
               */
              if (called) return;
              called = true;

              /**
               * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
               */
              reject(e);
          }
      } else {
          // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
          resolve(x);
      }
  } else {
      // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
      return resolve(x);
  }
}

myPromise.all = function (promises) {
  //promises是一个promise的数组
  return new myPromise(function (resolve, reject) {
    let arr = []; //arr是最终返回值的结果
    let i = 0; // 表示成功了多少次
    function processData(index, data) {
      arr[index] = data;
      if (++i === promises.length) {
        resolve(arr);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function (data) {
        processData(i, data);
      }, reject);
    }
  });
};
// 只要有一个promise成功了 就算成功。如果第一个失败了就失败了
myPromise.race = function (promises) {
  return new myPromise((resolve, reject) => {
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};
// 生成一个成功的promise
myPromise.resolve = function (value) {
  return new myPromise((resolve, reject) => resolve(value));
};
// 生成一个失败的promise
myPromise.reject = function (reason) {
  return new myPromise((resolve, reject) => reject(reason));
};
myPromise.defer = myPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new myPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = myPromise;
