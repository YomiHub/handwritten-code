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
        this.status = "resolved";
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.status === "pending") {
        this.reason = reason;
        this.status = "rejected";
        this.onRejectedCallbacks.forEach((fn) => fn());
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
    if (this.status === "resolved") {
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
//引用自：https://juejin.cn/post/6844903607968481287
function resolvePromise(promise2, x, resolve, reject) {
  //判断x是不是promise
  //规范中规定：我们允许别人乱写，这个代码可以实现我们的promise和别人的promise 进行交互
  if (promise2 === x) {
    //不能自己等待自己完成
    return reject(new TypeError("循环引用"));
  }
  // x是除了null以外的对象或者函数
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    let called; //防止成功后调用失败
    try {
      //防止取then是出现异常  object.defineProperty
      let then = x.then; //取x的then方法 {then:{}}
      if (typeof then === "function") {
        //如果then是函数就认为他是promise
        //call第一个参数是this，后面的是成功的回调和失败的回调
        then.call(
          x,
          (y) => {
            //如果Y是promise就继续递归promise
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            //只要失败了就失败了
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        //then是一个普通对象，就直接成功即可
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    //x = 123 x就是一个普通值 作为下个then成功的参数
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    //默认状态是等待状态
    this.status = "panding";
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
        this.status = "resolved";
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.status === "pending") {
        this.reason = reason;
        this.status = "rejected";
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      //执行时可能会发生异常
      executor(resolve, reject);
    } catch (e) {
      reject(e); //promise失败了
    }
  }
  then(onFuiFilled, onRejected) {
    //防止值得穿透
    onFuiFilled = typeof onFuiFilled === "function" ? onFuiFilled : (y) => y;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2; //作为下一次then方法的promise
    if (this.status === "resolved") {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            //成功的逻辑 失败的逻辑
            let x = onFuiFilled(this.value);
            //看x是不是promise 如果是promise取他的结果 作为promise2成功的的结果
            //如果返回一个普通值，作为promise2成功的结果
            //resolvePromise可以解析x和promise2之间的关系
            //在resolvePromise中传入四个参数，第一个是返回的promise，第二个是返回的结果，第三个和第四个分别是resolve()和reject()的方法。
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
    if (this.status === "rejected") {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            //在resolvePromise中传入四个参数，第一个是返回的promise，第二个是返回的结果，第三个和第四个分别是resolve()和reject()的方法。
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
    //当前既没有完成也没有失败
    if (this.status === "pending") {
      promise2 = new Promise((resolve, reject) => {
        //把成功的函数一个个存放到成功回调函数数组中
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFuiFilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        //把失败的函数一个个存放到失败回调函数数组中
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      });
    }
    return promise2; //调用then后返回一个新的promise
  }
  catch(onRejected) {
    // catch 方法就是then方法没有成功的简写
    return this.then(null, onRejected);
  }
}
Promise.all = function (promises) {
  //promises是一个promise的数组
  return new Promise(function (resolve, reject) {
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
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};
// 生成一个成功的promise
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => resolve(value));
};
// 生成一个失败的promise
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
