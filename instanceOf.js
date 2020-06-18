//?实现instanof方法 判断变量right的原型存在于left的原型链上
/**
 * 
 * @param {left} left a instance
 * @param {*} right a prototype
 */
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



