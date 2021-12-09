// async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await
// 改进 
// 1、内置执行器   2、更好的语义(async表示有异步操作，await表示表达式需等待结果)   
// 3、更广的的适用性(yield命令后面只能是 Thunk 函数或 Promise 对象)   4、返回值为Promise

function generatorToAsync(genFn) {
  return function () {
    //包一层函数用于接收可能传递的参数
    const gen = genFn.apply(this, arguments);

    return new Promise((resolve, reject) => {
      const doTask = (key, arg) => {
        let res;
        try {
          res = gen[key](arg); //执行next或者throw
        } catch (error) {
          return reject(error);
        }

        const { value, done } = res;
        if (done) {
          //执行完毕
          return resolve(value);
        } else {
          //value可能是常量；Promise有可能有失败和成功状态
          return Promise.resolve(value).then(
            (val) => {
              doTask("next", val);
            },
            (err) => {
              doTask("throw", err);
            }
          );
        }
      };

      doTask("next"); //首次调用
    });
  };
}

function fn(a, b) {
  return a + b;
}

function* testGen() {
  let num1 = yield fn(1, 2); //等同于 await fn(1)
  console.log(num1);  //3
  let num2 = yield fn(num1, 3);
  console.log(num2); //  6
  return num2;
}

const toAsync = generatorToAsync(testGen);
const asyncRes = toAsync();
console.log(asyncRes);  //Promise { <pending> }
asyncRes.then((res) => {
  console.log(res);  //  6
});