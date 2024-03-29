// 实现promise.all()
// Promise.all() 方法接收一个promise的iterable类型的输入，并且只返回一个Promise实例
// 输入的所有promise的resolve回调的结果是一个数组
// 这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候
// reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息

// 总结：接收一个数组，数组里面可以是Promise实例也可以不是；等待所有都完成（或第一个失败）；执行的结果也是一个Promise

Promise.myAll = (promises) => {
  // 符合条件3，返回一个Promise
  return new Promise((rs, rj) => {
    let count = 0;
    let result = [];
    const len = promises.length;

    promises.forEach((p, i) => {
      // 符合条件1，将数组里的项通过Promise.resolve进行包装
      Promise.resolve(p)
        .then((res) => {
          count += 1;
          result[i] = res;
          // 符合条件2 等待所有都完成
          if (count === len) {
            rs(result);
          }
          // 符合条件2  只要一个失败就都失败
        })
        .catch(rj);
    });
  });
};

let p1 = Promise.resolve(1);
let p2 = 2;
let p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 3);
});

let p4 = Promise.reject("出错啦");

Promise.myAll([p1, p2, p3]).then((res) => {
  console.log(res); // [ 1, 2, 3 ]
});

Promise.myAll([p1, p2, 3])
  .then((res) => {
    console.log(res); // [ 1, 2, 3 ]
  })
  .catch((err) => {
    console.log("err", err);
  });

Promise.myAll([p1, p2, p4])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log("err", err); // err 出错啦
  });

// 实现Promise.race
// Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝
Promise.myRace = (promises) => {
  return new Promise((rs, rj) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(rs).catch(rj); // 只要有任意一个完成了或者拒绝了，race也就结束了
    });
  });
};

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 1);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 2);
});

Promise.myRace([promise1, promise2]).then((value) => {
  // 因为promise2更快所以打印出2
  console.log(value); // 2
});

Promise.myRace([promise1, promise2, 3]).then((value) => {
  // 3比其他两个更快
  console.log(value); // 3
});

// Promise.any() 接收一个Promise可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promis
Promise.myAny = function(promises){
  return new Promise((resolve,reject)=>{
    promises = Array.isArray(promises) ? promises : []
    let len = promises.length
    let errs = []
    // 如果传入的是一个空数组，那么就直接返回
    if(len === 0) return reject(new Error('All promises were rejected'))

    promises.forEach((promise)=>{
      promise.then(value=>{
        resolve(value)
      },err=>{
        len--
        errs.push(err)
        if(len === 0){
          reject(new Error(errs)) //AggregateError 可传入数组类型Error
        }
      })
    })
  })
}


// 来源链接：https://juejin.cn/post/7018337760687685669
//实现并行限制的promise
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.queues = [];
    this.curCount = 0;
  }

  add(time,order) {
    this.queues.push(() => {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          console.log(order)
          resolve();
        },time)
      });
    });
  }

  taskStart(){
    for(let i = 0; i<this.limit; ++i){
      this.request();
    }
  }

  request(){
    if(!this.queues.length||this.curCount>=this.limit) return;

    this.curCount++;
    this.queues.shift()().then(()=>{
      this.curCount--;
      this.request();
    })
  }
}

let schedule = new Scheduler(2);

schedule.add(1000,'1');
schedule.add(500,'2');
schedule.add(300,'3');
schedule.add(400,'4');
schedule.taskStart();

//Promise 串行
//方法一  通过循环进行串行
Promise.mySerial1 = (promises)=>{
  let result = [];
  let index = 0;
  
  return new Promise((resolve,reject)=>{
    const doTask = ()=>{
      Promise.resolve(promises[index]).then(res=>{
        index++;
        result.push(res);
        if(index === promises.length){
          return resolve(result);
        }
        doTask(); //执行下一个任务
      }).catch(err=>{
        return reject(err) 
      })
    }

    doTask();
  })
}

//方法二是借助reduce函数
Promise.mySerial2 = (promises)=>{
  let result = [];
  return promises.reduce((callBack,item,index)=>{
    return callBack.then(res=>{
      return Promise.resolve(item).then(res=>{ //Promise.resolve兼容非promise任务
        result[index] = res;
        return index === promises.length-1?result:item;
      })
    })
  },Promise.resolve()); //(累加器，初始值)
}

Promise.mySeria2([p1, p2, p3]).then((res) => {
  console.log(res); // [ 1, 2, 3 ]
});

// 实现retry：function retry(fn,times,delay)，fn为异步请求，经过retry包装后，首先执行fn，如果失败则每隔delay的时间尝试一次，直到最后失败。
function retry(fn,times,delay){
  let time = 0;
  return new Promise((resolve,reject)=>{
      const attemp = ()=>{
          Promise.resolve(fn)
          .then(resolve)
          .catch(err=>{
              time++;
              console.log("尝试失败");
              if(time==times){
                  reject(err);
              }else{
                  setTimeOut(()=>{
                      attemp();
                  },delay)
              }
          })
      }
      attemp();
  })
}
