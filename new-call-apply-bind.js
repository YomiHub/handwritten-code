//?实现new方法
/* 1.创建空对象
2.链接原型
3.修改this指向
4.返回新对象 */

function createNew () {
  var obj = {};  //new Object();
  var constructor = [].shift.apply(arguments);  //var [constructor,...args] = [...arguments]
  obj._proto_ = constructor.prototype; //链接原型
  var res = constructor.apply(obj, arguments);  //修改this指向
  return typeof res == 'object' ? res : obj;  //返回新对象
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

//获取唯一的方法名称
function getSymbol (obj) {
  let unique = (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
  if (obj.hasOwnProperty(unique)) { //避免覆盖已经存在的fn
    return getSymbol(obj);
  } else {
    return unique;
  }
}

Function.prototype.mycall = function (context) {
  if (typeof this !== 'function') {
    throw Error('this is not function');
  }

  context = context || window;
  let fn = getSymbol(context);
  context.fn = this;
  let args = [...arguments].slice(1);
  let res = arguments.length > 1 ? context.fn(...args) : context.fn();
  delete context.fn;
  return res;
}


//?实现 apply 方法 ，参数接受一个数组，返回函数执行结果
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw Error('this is not function');
  }

  context = context || window;
  let fn = getSymbol(context);
  context.fn = this;
  let res = arguments[1].length ? context.fn(...arguments[1]) : context.fn();
  return res;
}


//? 实现bind方法，参数逐个列出，返回尚未执行的函数；类似于call，逐个传参，但是支持柯里化传参f(a)(b)
Function.prototype.mybind = function (context) {
  if (typeof this !== 'function') {
    throw Error('this is not function');
  }

  context = context || window;
  let fn = getSymbol(context);
  context.fn = this;
  let _this = this;
  let args = arguments.slice(1); //截取context以外的参数
  return function F () {
    if (this instanceof F) {  //判断是否第一次调用F()
      return new _this(...args, ...arguments);  //已经改变this指向，传参执行函数
    } else {
      return _this.myapply(context, args.concat(...arguments));  //改变this指向时传递的参数与函数执行时的参数合并
    }
  }
}


var personOne = {
  name: 'hjx',
  age: 16
}

person.getMessage.mycall(personOne, 1, 2);  //hjx 16 [Arguments] { '0': 1, '1': 2 }
person.getMessage.myApply(personOne, [1, 2]);//hjx 16 [Arguments] { '0': 1, '1': 2 }

let bindFn = person.getMessage.bind(personOne);
bindFn(1, 2);  //hjx 16 [Arguments] { '0': 1, '1': 2 }

let bindFn2 = person.getMessage.bind(personOne, 1);
bindFn2(2);  //hjx 16 [Arguments] { '0': 1, '1': 2 }