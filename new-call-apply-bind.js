//?实现new方法
/* 1.创建空对象
2.链接原型
3.修改this指向
4.返回新对象 */

function createNew () {
  var obj = {};  //new Object();
  var constructor = [].shift.apply(arguments);  //var [constructor,...args] = [...arguments]
  obj.__proto__ = constructor.prototype; //链接原型
  var res = constructor.apply(obj, arguments);  //修改this指向
  return typeof res == 'object' ? res : obj;  //返回新对象
}

function createNew(fn, ...args) {
  let obj = Object.create(fn);
  let res = fn.call(obj, ...args);

  if (res && (typeof res == "object" || typeof res == "function")) {
    return res;
  }
  return obj;
}

function People (name, age) {
  this.name = name;
  this.age = age;
  this.getMessage = function () {
    console.log(this.name, this.age, arguments);
  }
}

var person = createNew(People, 'hym', 21);
person.getMessage();  //hym 21 [Arguments] {}

//?实现 call 方法，将需要改变this指向的方法挂载到目标 this 并返回；参数逐个列出，返回函数执行结果
//使用symbol类型（apply同理，只是传参是数组，接收参数时无需解构）
Function.prototype.myCall = function(context, ...args){
  if (!context || context == null) {
    context = window
  }

  let fn = Symbol()
  context[fn] = this
  let res = arguments.length > 1 ? context[fn](...args) : context[fn]()
  delete context[fn]
  return res
}

//获取唯一的方法名称
function getSymbol (obj) {
  let unique = (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
  if (obj.hasOwnProperty(unique)) { //避免覆盖已经存在的fn
    return getSymbol(obj);
  } else {
    return unique;
  }
}

Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw Error('this is not function');
  }

  context = context || window;
  let fn = getSymbol(context);
  context[fn] = this;
  let args = [...arguments].slice(1);
  let res = arguments.length > 1 ? context[fn](...args) : context[fn]();
  delete context[fn];
  return res;
}


//?实现 apply 方法 ，参数接受一个数组，返回函数执行结果
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw Error('this is not function');
  }

  context = context || window;
  let fn = getSymbol(context);
  context[fn] = this;
  let res = arguments[1].length ? context[fn](...arguments[1]) : context[fn]();
  return res;
}


//? 实现bind方法，参数逐个列出，返回尚未执行的函数；类似于call，逐个传参，但是支持柯里化传参f(a)(b)
Function.prototype.myBind = function (context, ...args) {
  if (typeof this != "function") {
    throw Error("this is not a function");
  }

  let fn = this;
  let F = function(){
    if(this instanceof F){
      new fn(...(args.concat(...arguments)));  // fn.apply(this, args.concat(...arguments));
    }else{
      fn.apply(context,args.concat(...arguments));
    }
  }
  F.prototype = Object.create(fn.prototype);  // 绑定原型链
  return F;
};

Function.prototype.myBind = function (context,...args) {
  //或者ES5截取context以外的参数 args = arguments.slice(1); //截取
  if(typeof this != 'function') {
    throw Error("this is not function")
  }

  context = context || window
  let fn = this;
  let F = function(){
    if(this instanceof F){ //是通过 new 调用的
      return new fn(...(args.concat(...arguments))); // fn.apply(this, args.concat(...arguments));
    }else{
      return fn.apply(context,args.concat(...arguments));//改变this指向时传递的参数与函数执行时的参数合并
    }
  }

  F.prototype = Object.create(fn.prototype);   // 绑定原型链
  return F;  //不是立即执行，而是返回函数
}

Function.prototype.mybind = function (context) {
  let self = this;
  let args = [...arguments].slice(1);

  return function () {
    let nextArgs = [...arguments];
    return self.myapply(context, args.concat(nextArgs));
  }
}


var personOne = {
  name: 'hjx',
  age: 16
}

person.getMessage.myCall(personOne, 1, 2);  //hjx 16 [Arguments] { '0': 1, '1': 2 }
person.getMessage.myApply(personOne, [1, 2]);//hjx 16 [Arguments] { '0': 1, '1': 2 }

let bindFn = person.getMessage.myBind(personOne);
bindFn(1, 2);  //hjx 16 [Arguments] { '0': 1, '1': 2 }

let bindFn2 = person.getMessage.myBind(personOne, 1);
bindFn2(2);  //hjx 16 [Arguments] { '0': 1, '1': 2 }