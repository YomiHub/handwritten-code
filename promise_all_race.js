// 实现promise.all()
// Promise.all() 方法接收一个promise的iterable类型的输入，并且只返回一个Promise实例
// 输入的所有promise的resolve回调的结果是一个数组
// 这个Promise的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候
// reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息


// 总结：接收一个数组，数组里面可以是Promise实例也可以不是；等待所有都完成（或第一个失败）；执行的结果也是一个Promise

Promise.myAll = (promises) => {
  // 符合条件3，返回一个Promise
  return new Promise((rs, rj) => {
    let count = 0
    let result = []
    const len = promises.length

    promises.forEach((p, i) => {
      // 符合条件1，将数组里的项通过Promise.resolve进行包装
      Promise.resolve(p).then((res) => {
        count += 1
        result[ i ] = res
        // 符合条件2 等待所有都完成
        if (count === len) {
          rs(result)
        }
        // 符合条件2  只要一个失败就都失败
      }).catch(rj)
    })
  })
}

let p1 = Promise.resolve(1)
let p2 = 2
let p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 3)
})

let p4 = Promise.reject('出错啦')

Promise.myAll([p1, p2, p3]).then((res) => {
  console.log(res); // [ 1, 2, 3 ]
});


Promise.myAll([ p1, p2, 3 ]).then((res) => {
  console.log(res) // [ 1, 2, 3 ]
}).catch((err) => {
  console.log('err', err)
})


Promise.myAll([ p1, p2, p4 ]).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log('err', err) // err 出错啦
})


// 实现Promise.race
// Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝

Promise.myRace  = (promises)=>{
  return new Promise((rs,rj)=>{
    promises.forEach((p)=>{
      Promise.resolve(p).then(rs).catch(rj); // 只要有任意一个完成了或者拒绝了，race也就结束了
    })
  })
}

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 1);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 2);
});

Promise.myRace([promise1, promise2]).then((value) => {
  // 因为promise2更快所以打印出2
  console.log(value) // 2
});

Promise.myRace([promise1, promise2, 3]).then((value) => {
  // 3比其他两个更快
  console.log(value) // 3
});


// 来源链接：https://juejin.cn/post/7018337760687685669
