//!浅拷贝
let obj = {
  list: {
    math: 99,
    english: 89
  },
  arr: [1, 2, 3],
  name: 'hym',
  age: 18,
  getName: function () {
    return this.name;
  }
}

let shallowOne = Object.assign(obj);  //?ES6新增的Object.assign()
let shallowTwo = { ...obj };  //?扩展运算符...

//?使用hasOwnProperty()结合for···in循环遍历属性（包含继承和自身可遍历属性），进行浅拷贝
function shallowCopy (obj) {
  let res = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      res[prop] = obj[prop]
    }
  }
  return res;
}

let shallowThree = shallowCopy(obj);

//!深拷贝
//?使用JSON.Stringify与JSON.parse，对于正则表达式，函数，或者undefined等值会失效
let deepOne = JSON.parse(JSON.stringify(obj));

//?递归实现深拷贝
function deepClone (obj) {
  var objClone = Array.isArray(obj) ? [] : {};  //obj instanceof Array ? [] : {}

  if (obj && typeof obj === 'object') {  //进行深拷贝的对象不为空
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {  //非继承的可遍历属性
        if (obj[prop] == obj) {   //避免互相引用导致死循环 foo.a = foo的情况
          continue;
        }

        //?var newObj = Object.create(oldObj)，可以达到深拷贝的效果
        //如果属性值为object类型则递归
        objClone[prop] = obj[prop] && typeof obj[prop] === 'object' ? deepClone(obj[prop]) : obj[prop]
      }
    }
  }else if (typeof obj == "function") {
    //将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。
    return Object.assign(obj);  //假如源值是一个对象的引用，它仅仅会复制其引用值
  }

  return objClone;
}

let deepTwo = deepClone(obj);  //递归拷贝

//!完整深拷贝，包括Symbol和不可遍历属性
function isObject (obj) {  //判断是否为对象
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isArray (obj) {  //判断是否为数组
  return Array.isArray(obj);
}

function clone (obj) {
  let res;
  if (isObject(obj)) {
    //拷贝对象
    res = {};
    let props = Reflect.ownKeys(obj);  //获取自身所有属性，包括Symbol和不可遍历属性
    for (let prop of props) {
      let value = obj[prop];
      if (obj[prop] == obj) {   //避免互相引用导致死循环 foo.a = foo的情况
        continue;
      }
      if (isObject(value) || isArray(value)) {
        res[prop] = clone(value);
      } else {
        //不使用res[prop] = obj[prop] 是因为这种方式无法复制get、set函数属性与不可枚举属性 
        Object.defineProperty(res, prop, Object.getOwnPropertyDescriptor(obj, prop));
      }
    }
    Object.setPrototypeOf(res, Object.getPrototypeOf(obj));  //保持原型一致
  } else if (isArray(obj)) {
    //拷贝数组时
    res = [];
    for (let value of obj) {
      if (value == obj) {   //避免互相引用导致死循环
        continue;
      }
      if (isObject(value) || isArray(value)) {
        res.push(clone(value));
      } else {
        res.push(value);
      }
    }

  } else if (obj !== undefined) {
    res = obj
  }
  return res;
}

let deepThree = clone(obj);

obj.name = 'hjx';
obj.list.math = 100;
obj.arr.push(4);
console.log(shallowOne);  //{ list: { math: 100, english: 89 },arr: [ 1, 2, 3, 4], name: 'hjx', age: 18, getName: [Function: getName]}
console.log(shallowTwo); //{ list: { math: 100, english: 89 },arr: [ 1, 2, 3 ,4 ], name: 'hym', age: 18, getName: [Function: getName]}
console.log(shallowThree);  //{ list: { math: 100, english: 89 },arr: [ 1, 2, 3 ,4 ], name: 'hym', age: 18, getName: [Function: getName] }
console.log(deepOne);  //{ list: { math: 99, english: 89 },arr: [ 1, 2, 3 ], name: 'hym', age: 18 }
console.log(deepTwo);  //{ list: { math: 99, english: 89 },arr: [ 1, 2, 3 ], name: 'hym', age: 18, getName: [Function: getName] }
console.log(deepThree);  //{ list: { math: 99, english: 89 },arr: [ 1, 2, 3 ], name: 'hym', age: 18, getName: [Function: getName] }