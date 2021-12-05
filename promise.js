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
function myPromise (constructor) {
  let self = this;
  self.status = 'pending';  //初始状态
  self.value = undefined;  //成功时的状态 resolved
  self.reason = undefined;  //失败时状态 rejected

  function resolve (value) {
    if (self.status === 'pending') {
      self.value = value;
      self.status = 'resolved';
    }
  }

  function reject (reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
    }
  }

  //捕获构造异常
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e)
  }
}

//可链式调用的then
myPromise.prototype.then = function (onFullfilled, onRejected) {
  let self = this;
  switch (self.status) {
    case 'resolved':
      onFullfilled(self.value);
      break;
    case 'rejected':
      onRejected(self.reason);
      break;
  }
}

var p = new myPromise(function (resolve, reject) {
  resolve(1);
});

p.then(function (data) {
  //成功
  console.log(data);  //1
}, function (reason) {
  //失败
})



//!比较完整的Promise
const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';
function myPromise (excutor) {
  let that = this;
  that.status = PENDING;
  that.value = undefined;  //fullfilled状态返回的数据
  that.reason = undefined; //rejected 状态返回错误的原因
  that.onFullfilledCallbacks = [];  //成功后执行的回调
  that.onRejectedCallbacks = [];  //失败后执行的回调

  function resolve (value) {
    if (value instanceof myPromise) {  //!避免无限循环
      return value.then(resolve, reject);
    }

    //定时器确保 onFulfilled 和 onRejected 方法异步执行，且在then调用事件循环后的新执行栈中执行
    setTimeout(() => {
      //执行状态不可逆，只能由pending状态到fullfilled，避免重复调用resolve、reject
      if (that.status === PENDING) {
        that.value = value;
        that.status = FULLFILLED;
        that.onFullfilledCallbacks.forEach(cb => cb(that.value));  //!回调对应的onFullfilled函数
      }
    });
  }

  function reject (reason) {
    setTimeout(() => {
      if (that.status === PENDING) {
        that.reason = reason;
        that.status = REJECTED;
        that.onRejectedCallbacks.forEach(cb => cb(that.reason)); //!回调对应onRejected函数
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
  onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {
    throw reason;
  }

  if (that.status === FULLFILLED) {
    return newPromise = new myPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFullfilled(that.value);
          newPromise.resolve(x);  // 新的promise resolve 上一个onFulfilled的返回值
        } catch (e) {
          reject(e);  //捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
        }
      });
    });
  }

  if (that.status === REJECTED) {
    return newPromise = new myPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onRejected(that.reason);
          newPromise.reject(x)
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  if (that.status === PENDING) {
    //异步执行时，将onFullfilled和onRejected放入到数组中；
    return newPromise = new myPromise((resolve, reject) => {
      that.onFullfilledCallbacks.push((value) => {
        try {
          let x = onFullfilled(that.value);
          newPromise.resolve(x);  // 新的promise resolve 上一个onFulfilled的返回值
        } catch (e) {
          reject(e);
        }
      });
      that.onRejectedCallbacks.push((reason) => {
        try {
          let x = onRejected(that.reason);
          ewPromise.reject(x)
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

var testTag = false;
var p = new myPromise(function (resolve, reject) {
  if (testTag) {
    //执行成功
    resolve(1);
  } else {
    reject(0);
  }
});

p.then(function (data) {
  //成功
  console.log(data);  //1
}, function (reason) {
  //失败
  console.log(reason);  //0
})