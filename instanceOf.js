//?实现instanof方法 判断变量right的原型存在于left的原型链上
/**
 * 
 * @param {left} left a instance
 * @param {*} right a prototype
 */
//遍历实现
const instanceOf1 = function(obj,func){
  if (obj === null || typeof obj !== 'object') {
    return false
  }

  let proto = obj

  while (proto = Object.getPrototypeOf(proto)) {
    if (proto === func.prototype) {
      return true
    }
  }

  return false
}

//递归实现
const instanceOf2 = function(obj,func){
  if(obj == null || typeof obj !== 'object'){
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  if(proto == func.prototype){
    return true;
  }else if(proto == null){
    return false;
  }else{
    return instanceOf2(proto,func);
  }
}
// 测试
let Fn = function () { }
let p1 = new Fn()

console.log(instanceOf2({}, Object)) // true
console.log(instanceOf2(p1, Fn)) // true
console.log(instanceOf2({}, Fn)) // false
console.log(instanceOf2(null, Fn)) // false
console.log(instanceOf2(1, Fn)) // false



function instanceOf (left, right) {
  var proto = left.__proto__;
  var prototype = right.prototype;
  while (true) {
    if (proto === null) {
      return false;
    }

    if (proto === prototype) {
      return true;
    }

    proto = proto.__proto__;
  }
}

var obj = { name: 'hym' };

console.log(instanceOf(obj, Object)); //true
console.log(obj instanceof Object); //true 编译器会检查 obj 是否能转换成右边的class类型，如果不能转换则直接报错

